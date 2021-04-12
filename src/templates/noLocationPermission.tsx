import { h } from '../alpinex';

export function renderNoLocationPermission(error?: string) {
  return (
    <div>
      Location permissions not granted.
    </div>
  );
}