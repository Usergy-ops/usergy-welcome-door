
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, Github, Linkedin, Twitter } from 'lucide-react';

interface SocialPresenceFormData {
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
  portfolio_url: string;
}

export const SocialPresenceSection: React.FC = () => {
  const { profileData, updateProfileData, setCurrentStep, currentStep } = useProfile();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, handleSubmit, watch } = useForm<SocialPresenceFormData>({
    defaultValues: {
      linkedin_url: profileData.linkedin_url || '',
      twitter_url: profileData.twitter_url || '',
      github_url: profileData.github_url || '',
      portfolio_url: profileData.portfolio_url || '',
    }
  });

  const validateURL = (url: string) => {
    if (!url) return true; // Empty URLs are valid (optional fields)
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleURLBlur = (field: string, value: string) => {
    if (value && !validateURL(value)) {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL' }));
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onSubmit = async (data: SocialPresenceFormData) => {
    // Validate all URLs before submitting
    const urlErrors: Record<string, string> = {};
    Object.entries(data).forEach(([field, url]) => {
      if (url && !validateURL(url)) {
        urlErrors[field] = 'Please enter a valid URL';
      }
    });

    if (Object.keys(urlErrors).length > 0) {
      setErrors(urlErrors);
      return;
    }

    try {
      await updateProfileData('profile', {
        ...data,
        section_5_completed: true
      });
      
      toast({
        title: "Social presence saved!",
        description: "Your social profiles have been updated successfully.",
      });

      // Move to next step
      setCurrentStep(currentStep + 1);
    } catch (error) {
      toast({
        title: "Error saving profiles",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Connect Your Digital Presence
        </h3>
        <p className="text-muted-foreground">
          Share your professional profiles to enhance your Explorer credibility
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Linkedin className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <Label htmlFor="linkedin_url" className="text-sm font-medium">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/your-profile"
                className="mt-1"
                onBlur={(e) => handleURLBlur('linkedin_url', e.target.value)}
              />
              {errors.linkedin_url && (
                <p className="text-red-500 text-sm mt-1">{errors.linkedin_url}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Github className="w-6 h-6" />
            <div className="flex-1">
              <Label htmlFor="github_url" className="text-sm font-medium">GitHub Profile</Label>
              <Input
                id="github_url"
                {...register('github_url')}
                placeholder="https://github.com/your-username"
                className="mt-1"
                onBlur={(e) => handleURLBlur('github_url', e.target.value)}
              />
              {errors.github_url && (
                <p className="text-red-500 text-sm mt-1">{errors.github_url}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Twitter className="w-6 h-6 text-blue-400" />
            <div className="flex-1">
              <Label htmlFor="twitter_url" className="text-sm font-medium">Twitter/X Profile</Label>
              <Input
                id="twitter_url"
                {...register('twitter_url')}
                placeholder="https://twitter.com/your-username"
                className="mt-1"
                onBlur={(e) => handleURLBlur('twitter_url', e.target.value)}
              />
              {errors.twitter_url && (
                <p className="text-red-500 text-sm mt-1">{errors.twitter_url}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Link className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <Label htmlFor="portfolio_url" className="text-sm font-medium">Portfolio/Website</Label>
              <Input
                id="portfolio_url"
                {...register('portfolio_url')}
                placeholder="https://your-website.com"
                className="mt-1"
                onBlur={(e) => handleURLBlur('portfolio_url', e.target.value)}
              />
              {errors.portfolio_url && (
                <p className="text-red-500 text-sm mt-1">{errors.portfolio_url}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-primary-start to-primary-end hover:opacity-90"
          >
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
};
