/**
 * Zod schemas for Relvanta Platform content.
 * These schemas mirror the Pydantic models on the backend.
 */
import { z } from 'zod';

// Enums
export const VisibilitySchema = z.enum(['public', 'protected', 'labs']);
export type Visibility = z.infer<typeof VisibilitySchema>;

export const StatusSchema = z.enum([
  'idea',
  'pilot',
  'beta',
  'live',
  'deprecated',
  'archived',
]);
export type Status = z.infer<typeof StatusSchema>;

export const LabStatusSchema = z.enum([
  'hypothesis',
  'running',
  'validated',
  'failed',
  'graduated',
]);
export type LabStatus = z.infer<typeof LabStatusSchema>;

export const EngagementTypeSchema = z.enum(['pilot', 'project', 'retainer']);
export type EngagementType = z.infer<typeof EngagementTypeSchema>;

export const RoleSchema = z.enum(['admin', 'collaborator', 'client']);
export type Role = z.infer<typeof RoleSchema>;

// Base content schema
export const ContentBaseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  visibility: VisibilitySchema,
  order: z.number().optional(),
});
export type ContentBase = z.infer<typeof ContentBaseSchema>;

// Product schema
export const ProductThemeSchema = z.object({
  primary_color: z.string().optional().nullable(),
  secondary_color: z.string().optional().nullable(),
});

export const ProductLinksSchema = z.object({
  demo: z.string().optional().nullable(),
  docs: z.string().optional().nullable(),
  external: z.string().optional().nullable(),
});

export const ProductSchema = ContentBaseSchema.extend({
  name: z.string().min(1).max(100),
  tagline: z.string().max(150),
  short_description: z.string().max(300),
  long_description: z.string(),
  category: z.string(),
  status: StatusSchema,
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().optional().nullable(),
  features: z.array(z.string()).optional().nullable(),
  target_audience: z.string().optional().nullable(),
  related_products: z.array(z.string()).optional().nullable(),
  links: ProductLinksSchema.optional().nullable(),
  theme: ProductThemeSchema.optional().nullable(),
});
export type Product = z.infer<typeof ProductSchema>;

// Service schema
export const ServiceSchema = ContentBaseSchema.extend({
  name: z.string().min(1).max(100),
  summary: z.string().max(300),
  description: z.string(),
  scope: z.array(z.string()),
  engagement_type: EngagementTypeSchema,
  deliverables: z.array(z.string()).optional().nullable(),
  duration: z.string().optional().nullable(),
  related_services: z.array(z.string()).optional().nullable(),
});
export type Service = z.infer<typeof ServiceSchema>;

// Lab schema
export const LabMetricSchema = z.object({
  name: z.string(),
  target: z.string(),
  actual: z.string().optional(),
});

export const LabSchema = ContentBaseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string(),
  hypothesis: z.string().optional(),
  status: LabStatusSchema,
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  graduated_to: z.string().optional(),
  visibility: z.literal('labs'),
  metrics: z.array(LabMetricSchema).optional(),
});
export type Lab = z.infer<typeof LabSchema>;

// Page schema
export const PageSEOSchema = z.object({
  title: z.string().optional(),
  description: z.string().max(160).optional(),
  og_image: z.string().optional(),
});

export const PageSchema = ContentBaseSchema.extend({
  title: z.string().min(1).max(100),
  content: z.string(),
  seo: PageSEOSchema.optional(),
});
export type Page = z.infer<typeof PageSchema>;

// Client Access schema
export const ClientAccessScopeSchema = z.object({
  products: z.array(z.string()),
  services: z.array(z.string()),
  labs: z.array(z.string()),
});

export const ClientAccessSchema = z.object({
  user_id: z.string(),
  organization_id: z.string().optional(),
  scope: ClientAccessScopeSchema,
  permissions: z.array(z.enum(['read', 'comment', 'edit'])),
  granted_at: z.coerce.date(),
  expires_at: z.coerce.date().optional(),
});
export type ClientAccess = z.infer<typeof ClientAccessSchema>;

// User schema
export const UserSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
  role: RoleSchema,
  organization_slug: z.string().optional(),
  created_at: z.coerce.date(),
});
export type User = z.infer<typeof UserSchema>;

// API Response schemas
export const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
});

export const ServiceListResponseSchema = z.object({
  services: z.array(ServiceSchema),
  total: z.number(),
});

export const LabListResponseSchema = z.object({
  labs: z.array(LabSchema),
  total: z.number(),
});
