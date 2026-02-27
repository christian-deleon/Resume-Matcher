"""Document parsing service using markitdown and LLM."""

import json
import logging
import tempfile
from pathlib import Path
from typing import Any

from markitdown import MarkItDown

from app.config import settings
from app.llm import complete_json
from app.prompts import PARSE_RESUME_PROMPT, get_date_rules
from app.prompts.templates import RESUME_SCHEMA_EXAMPLE
from app.schemas import ResumeData

logger = logging.getLogger(__name__)


def _get_preserve_months() -> bool:
    """Read the preserve_months setting from config."""
    config_path = settings.config_path
    if not config_path.exists():
        return False
    try:
        config = json.loads(config_path.read_text())
        return config.get("preserve_months", False)
    except (json.JSONDecodeError, OSError) as e:
        logger.warning("Failed to read config for preserve_months: %s", e)
        return False


async def parse_document(content: bytes, filename: str) -> str:
    """Convert PDF/DOCX to Markdown using markitdown.

    Args:
        content: Raw file bytes
        filename: Original filename for extension detection

    Returns:
        Markdown text content
    """
    suffix = Path(filename).suffix.lower()

    # Write to temp file for markitdown
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)

    try:
        md = MarkItDown()
        result = md.convert(str(tmp_path))
        return result.text_content
    finally:
        tmp_path.unlink(missing_ok=True)


async def parse_resume_to_json(markdown_text: str) -> dict[str, Any]:
    """Parse resume markdown to structured JSON using LLM.

    Args:
        markdown_text: Resume content in markdown format

    Returns:
        Structured resume data matching ResumeData schema
    """
    preserve_months = _get_preserve_months()
    date_rules = get_date_rules(preserve_months)

    prompt = PARSE_RESUME_PROMPT.format(
        schema=RESUME_SCHEMA_EXAMPLE,
        date_rules=date_rules,
        resume_text=markdown_text,
    )

    result = await complete_json(
        prompt=prompt,
        system_prompt="You are a JSON extraction engine. Output only valid JSON, no explanations.",
        max_tokens=8192,
    )

    # Validate against schema
    validated = ResumeData.model_validate(result)
    return validated.model_dump()
