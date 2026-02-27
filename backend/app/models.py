from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Add your models here
# Example:
# from sqlalchemy import Column, Integer, String, DateTime
# from datetime import datetime
#
# class User(Base):
#     __tablename__ = "users"
#     
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     created_at = Column(DateTime, default=datetime.utcnow)
