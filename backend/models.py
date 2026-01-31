"""
Pydantic models for Relvanta Platform content.
These models mirror the Zod schemas that will be used in the Next.js frontend.
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum


# Enums
class Visibility(str, Enum):
    PUBLIC = "public"
    PROTECTED = "protected"
    LABS = "labs"


class Status(str, Enum):
    IDEA = "idea"
    PILOT = "pilot"
    BETA = "beta"
    LIVE = "live"
    DEPRECATED = "deprecated"
    ARCHIVED = "archived"


class LabStatus(str, Enum):
    HYPOTHESIS = "hypothesis"
    RUNNING = "running"
    VALIDATED = "validated"
    FAILED = "failed"
    GRADUATED = "graduated"


class EngagementType(str, Enum):
    PILOT = "pilot"
    PROJECT = "project"
    RETAINER = "retainer"


class Role(str, Enum):
    ADMIN = "admin"
    COLLABORATOR = "collaborator"
    CLIENT = "client"


# Base content model
class ContentBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(..., description="Stable UUID identifier")
    slug: str = Field(..., description="URL-safe identifier", pattern="^[a-z0-9-]+$")
    created_at: datetime = Field(..., description="ISO 8601 datetime")
    updated_at: datetime = Field(..., description="ISO 8601 datetime")
    visibility: Visibility
    order: Optional[int] = Field(None, description="For explicit sorting")


# Product model
class ProductTheme(BaseModel):
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None


class ProductLinks(BaseModel):
    demo: Optional[str] = None
    docs: Optional[str] = None
    external: Optional[str] = None


class Product(ContentBase):
    name: str = Field(..., min_length=1, max_length=100)
    tagline: str = Field(..., max_length=150)
    short_description: str = Field(..., max_length=300)
    long_description: str = Field(..., description="MDX content")
    category: str
    status: Status
    accent_color: str = Field(..., pattern="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = None
    features: Optional[List[str]] = None
    target_audience: Optional[str] = None
    related_products: Optional[List[str]] = Field(None, description="Array of product IDs")
    links: Optional[ProductLinks] = None
    theme: Optional[ProductTheme] = None


# Service model
class Service(ContentBase):
    name: str = Field(..., min_length=1, max_length=100)
    summary: str = Field(..., max_length=300)
    description: str = Field(..., description="MDX content")
    scope: List[str]
    engagement_type: EngagementType
    deliverables: Optional[List[str]] = None
    duration: Optional[str] = Field(None, description="e.g., '2-4 weeks'")
    related_services: Optional[List[str]] = Field(None, description="Array of service IDs")


# Lab model
class LabMetric(BaseModel):
    name: str
    target: str
    actual: Optional[str] = None


class Lab(ContentBase):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., description="MDX content")
    hypothesis: Optional[str] = Field(None, description="What are you testing?")
    status: LabStatus
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    graduated_to: Optional[str] = Field(None, description="Product ID if promoted")
    visibility: Literal[Visibility.LABS] = Visibility.LABS
    metrics: Optional[List[LabMetric]] = None


# Page model
class PageSEO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = Field(None, max_length=160)
    og_image: Optional[str] = None


class Page(ContentBase):
    title: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., description="MDX content")
    seo: Optional[PageSEO] = None


# Client Access model
class ClientAccessScope(BaseModel):
    products: List[str] = Field(default_factory=list, description="Product IDs user can access")
    services: List[str] = Field(default_factory=list, description="Service IDs")
    labs: List[str] = Field(default_factory=list, description="Lab IDs")


class ClientAccess(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    user_id: str
    organization_id: Optional[str] = None
    scope: ClientAccessScope
    permissions: List[Literal["read", "comment", "edit"]]
    granted_at: datetime
    expires_at: Optional[datetime] = None


# Redirect model
class Redirect(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    from_path: str = Field(..., alias="from")
    to_path: str = Field(..., alias="to")
    permanent: bool = True


# User models for authentication
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    user_id: str = Field(..., description="Custom UUID (not MongoDB _id)")
    email: str
    name: str
    picture: Optional[str] = None
    role: Role = Role.CLIENT
    organization_slug: Optional[str] = None
    created_at: datetime


class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime


# Response models for API
class ProductListResponse(BaseModel):
    products: List[Product]
    total: int


class ServiceListResponse(BaseModel):
    services: List[Service]
    total: int


class LabListResponse(BaseModel):
    labs: List[Lab]
    total: int
