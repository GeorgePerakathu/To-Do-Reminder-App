

FROM python:3.9-slim


WORKDIR /app

COPY . /app


RUN --mount=type=cache,id=pip_cache,target=/root/.cache/pip \
    python -m venv --copies /opt/venv && \
    /opt/venv/bin/python -m pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

EXPOSE 80


ENV NAME World


CMD ["python", "app.py"]