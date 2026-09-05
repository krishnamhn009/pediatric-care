from fastapi import FastAPI

app = FastAPI(title="Pedia Centre API")


@app.get("/")
def read_root():
    return {"message": "Pedia Centre API is running"}