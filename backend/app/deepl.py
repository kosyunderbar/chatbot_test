import json
import os
from pathlib import Path
from urllib.parse import urlencode
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from dotenv import load_dotenv


load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")


class DeepLTranslationError(RuntimeError):
    pass


def translate_text(
    text: str,
    target_lang: str = "KO",
) -> dict:
    api_key = os.getenv("DEEPL_API_KEY", "").strip()
    api_url = os.getenv("DEEPL_API_URL", "https://api-free.deepl.com/v2/translate")

    if not api_key:
        raise DeepLTranslationError("DEEPL_API_KEY is not set")

    payload = {
        "text": text,
        "target_lang": target_lang,
    }

    encoded_payload = urlencode(payload).encode("utf-8")
    request = Request(
        api_url,
        data=encoded_payload,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"DeepL-Auth-Key {api_key}",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=15) as response:
            body = response.read().decode("utf-8")
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise DeepLTranslationError(f"DeepL request failed: {exc.code} {exc.reason} - {error_body}") from exc
    except Exception as exc:
        raise DeepLTranslationError(f"DeepL request failed: {exc}") from exc

    response_data = json.loads(body)
    translations = response_data.get("translations", [])
    if not translations:
        raise DeepLTranslationError("DeepL returned no translations")

    first_translation = translations[0]
    return {
        "source_text": text,
        "translated_text": first_translation.get("text", ""),
        "target_lang": target_lang,
        "detected_source_lang": first_translation.get("detected_source_lang"),
    }