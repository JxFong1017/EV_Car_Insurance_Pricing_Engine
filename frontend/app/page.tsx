import Link from 'next/link';
import { Zap, Shield, TrendingUp, MapPin, Car, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950 py-24 sm:py-32">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center animate-slide-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl flex items-center justify-center gap-3">
              <Zap className="h-12 w-12 text-emerald-400" />
              <span className="text-emerald-400">VoltVision</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl font-medium text-white max-w-3xl mx-auto leading-tight">
              EV Commercial Pricing Engine
            </p>
            <p className="mt-6 text-lg leading-8 text-emerald-50 max-w-2xl mx-auto">
              Poisson-Gamma GLM actuarial pricing for Malaysian electric vehicles. CAS-standard, MFRS 17 compliant.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-lg h-14 px-8 rounded-full shadow-premium transition-transform hover:scale-105">
                <Link href="/quote">
                  Calculate Your Premium <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 pt-8 border-t border-white/10 text-emerald-100 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white mb-1">λ₀ = 0.0841</span>
                <span className="text-sm">Base Frequency</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white mb-1">16</span>
                <span className="text-sm">States Covered</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white mb-1">6</span>
                <span className="text-sm">Add-on Riders</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white mb-1">MFRS 17</span>
                <span className="text-sm">Compliant Build</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-card hover:shadow-card-hover transition-shadow bg-white">
                <CardContent className="pt-8 text-center flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Factor GLM Rating</h3>
                  <p className="text-slate-600">Advanced statistical models factoring in power output, battery capacity, ground clearance, and brand segment for precise risk selection.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-card hover:shadow-card-hover transition-shadow bg-white">
                <CardContent className="pt-8 text-center flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Car className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">12 EV Models Catalogued</h3>
                  <p className="text-slate-600">Smart Auto-Map automatically pulls exact vehicle specifications for popular EVs from BYD, Tesla, smart, and more.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-card hover:shadow-card-hover transition-shadow bg-white">
                <CardContent className="pt-8 text-center flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">3 Commercial Tiers</h3>
                  <p className="text-slate-600">Tailored packages for Condo Dwellers, Landed Homeowners, and heavy users, plus specialized EV riders like Cable Theft and Cyber V2G.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Zap className="h-5 w-5 text-emerald-600" /> VoltVision
          </div>
          <div className="text-sm text-slate-500 flex gap-6">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Malaysia</span>
            <span>Internal Actuarial Tool</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
