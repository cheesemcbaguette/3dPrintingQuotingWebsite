import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  // Set a code in local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get a code from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove a code from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}
