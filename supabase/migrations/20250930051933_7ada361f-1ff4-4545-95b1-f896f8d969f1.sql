-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_uid UUID NOT NULL,
    project_details JSONB NOT NULL,
    criteria_selections JSONB NOT NULL DEFAULT '{}',
    other_automation_details JSONB NOT NULL DEFAULT '{}',
    uploaded_evidence JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (auth.uid() = owner_uid);

CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = owner_uid);

CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (auth.uid() = owner_uid);

CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (auth.uid() = owner_uid);

-- Create storage bucket for project evidence
INSERT INTO storage.buckets (id, name, public) VALUES ('project-evidence', 'project-evidence', false);

-- Create storage policies for project evidence
CREATE POLICY "Users can view their own evidence"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own evidence"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own evidence"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own evidence"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-evidence' AND auth.uid()::text = (storage.foldername(name))[1]);