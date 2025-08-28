# logger.py
# -------------------------------------------------------
# Logger dùng chung cho Server/Client/chess_core:
# - Ghi file xoay vòng: logs/<app>.log
# - In ra console
# - Tùy chọn ghi JSON
# - Bắt exception chưa bắt -> log
# - Tạo logger con theo kết nối để truy vết
# -------------------------------------------------------

import json
import logging
import logging.handlers
import os
import sys
from typing import Optional, Dict, Any

DEFAULT_FMT = "[%(asctime)s] %(levelname)s [%(name)s] %(message)s"
DATE_FMT = "%Y-%m-%d %H:%M:%S"

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": self.formatTime(record, DATE_FMT),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
        }
        for k, v in record.__dict__.items():
            if k in ("name","msg","args","levelname","levelno","pathname","filename",
                     "module","exc_info","exc_text","stack_info","lineno","funcName",
                     "created","msecs","relativeCreated","thread","threadName",
                     "processName","process"):
                continue
            payload[k] = v
        if record.exc_info:
            payload["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)

def _level(level: str | int) -> int:
    if isinstance(level, int): return level
    return {
        "CRITICAL": logging.CRITICAL, "ERROR": logging.ERROR,
        "WARN": logging.WARN, "WARNING": logging.WARNING,
        "INFO": logging.INFO, "DEBUG": logging.DEBUG, "NOTSET": logging.NOTSET
    }.get(str(level).upper(), logging.INFO)

def setup_logging(app_name: str,
                  log_dir: str = "logs",
                  level: str | int = "INFO",
                  json_file: bool = False,
                  max_bytes: int = 1_000_000,
                  backup_count: int = 5) -> logging.Logger:
    os.makedirs(log_dir, exist_ok=True)
    logger = logging.getLogger(app_name)
    logger.setLevel(_level(level))
    logger.propagate = False
    if logger.handlers:
        return logger

    file_path = os.path.join(log_dir, f"{app_name}.log")
    fhandler = logging.handlers.RotatingFileHandler(
        file_path, maxBytes=max_bytes, backupCount=backup_count, encoding="utf-8"
    )
    fhandler.setFormatter(JSONFormatter() if json_file else logging.Formatter(DEFAULT_FMT, DATE_FMT))
    fhandler.setLevel(_level(level))

    chandler = logging.StreamHandler(sys.stdout)
    chandler.setFormatter(logging.Formatter(DEFAULT_FMT, DATE_FMT))
    chandler.setLevel(_level(level))

    logger.addHandler(fhandler)
    logger.addHandler(chandler)

    def _excepthook(exc_type, exc_value, exc_traceback):
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_traceback); return
        logger.exception("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))
    sys.excepthook = _excepthook

    logger.info("Logger initialized (file: %s, level=%s, json=%s)", file_path, level, json_file)
    return logger

def get_child_logger(parent: logging.Logger,
                     name_suffix: Optional[str] = None,
                     extra: Optional[Dict[str, Any]] = None) -> logging.LoggerAdapter:
    name = parent.name if not name_suffix else f"{parent.name}.{name_suffix}"
    base = logging.getLogger(name)
    return logging.LoggerAdapter(base, extra or {})
