"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from 'react';
import { User } from '@/lib/database.types';
import LogoutButton from './auth/LogoutButton';

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.authenticated && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error('Failed to check auth status:', error)
      }
    }

    checkAuth()
  }, [])

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto p-4 flex justify-between items-center">
        
        <Link href="/" className="text-2xl font-bold">
          FUTSAL<span className="text-primary">KU</span>
        </Link>
        
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/lapangan" className={navigationMenuTriggerStyle()}>
                  Lapangan
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/booking" className={navigationMenuTriggerStyle()}>
                  Booking
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex gap-2">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Daftar</Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}