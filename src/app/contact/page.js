import { Suspense } from 'react';
import ContactContent from './ContactContent';
import { Section, Container, Card } from '@/components/ui';

function LoadingFallback() {
  return (
    <>
      <Section background="white" padding="md" className="pt-8">
        <Container>
          <div className="text-center animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-96 max-w-full mx-auto"></div>
          </div>
        </Container>
      </Section>

      <Section background="light">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 animate-pulse">
              <div className="h-7 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card className="p-8 animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-56 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-80 mb-6"></div>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded w-48"></div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContactContent />
    </Suspense>
  );
}
