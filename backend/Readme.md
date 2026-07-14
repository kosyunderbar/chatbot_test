backend 폴더입니다.

## FastAPI 실행 방법

Windows 기준으로 아래 순서로 실행하면 됩니다.

```bash
cd backend
python -m venv localhub_env
source localhub_env/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

실행 후 브라우저에서 `http://127.0.0.1:8000/docs` 로 접속하면 API 문서를 확인할 수 있습니다.