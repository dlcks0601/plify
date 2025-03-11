'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useAuthMutation } from '@/hooks/queries/auth.query';
import LoadingSpinner from '@/app/components/Common/LoadingSpinner';

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const params = useParams<{ provider?: string | string[] }>();
  let provider = '';

  if (typeof params.provider === 'string') {
    provider = params.provider;
  } else if (Array.isArray(params.provider) && params.provider.length > 0) {
    provider = params.provider[0];
  }

  const authMutation = useAuthMutation();
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (code && provider && !hasCalledRef.current) {
      hasCalledRef.current = true;
      authMutation.mutate({
        authorizationCode: code,
        provider: provider,
      });
    }
  }, [code, provider, authMutation]);

  return <LoadingSpinner />;
}
