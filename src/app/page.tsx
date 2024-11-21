"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/Login');
  }, [router]);

  return null;
};

export default Home;