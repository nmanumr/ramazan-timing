import { h } from '../alpinex';

function askLocationPermission() {
  navigator.geolocation.getCurrentPosition(() => {});
}

export function renderNoLocationPermission(error?: string) {
  return (
    <div class="h-[calc(100vh-60px)] w-full flex justify-center items-center">
      <div>
        <div>
          <svg class="w-24 h-24 mx-auto" fill="none" viewBox="0 0 433 433">
            <path class="text-gray-200" fill="currentColor" d="M112 153.806c0 44.841 69.118 132.585 103.999 172.194C250.881 286.379 320 198.617 320 153.806 319.999 96.568 273.345 50 215.999 50 158.653 50 112 96.568 112 153.806zm103.999-59.239c29.379 0 53.28 23.857 53.28 53.18 0 29.324-23.901 53.181-53.28 53.181s-53.28-23.857-53.28-53.181c0-29.323 23.901-53.18 53.28-53.18z"/>
            <path class="text-gray-400" fill="currentColor" d="M379.998 326.86l-107.88-37.006a830.067 830.067 0 009.501-12.696c39.308-53.639 59.24-95.234 59.24-123.628 0-68.667-56.012-124.53-124.86-124.53S91.139 84.863 91.139 153.531c0 28.394 19.933 69.988 59.241 123.628a838.198 838.198 0 009.578 12.796L52.011 326.857A10.351 10.351 0 0045 336.642a10.352 10.352 0 007.002 9.792l160.346 55.004a10.434 10.434 0 006.74.003l160.901-55.003a10.353 10.353 0 007.011-9.785 10.353 10.353 0 00-7.002-9.793zm-59.892-173.329c0 44.821-69.191 132.605-104.108 172.236-34.917-39.62-104.105-127.385-104.105-172.236 0-57.253 46.701-103.832 104.106-103.832 57.405 0 104.107 46.579 104.107 103.832zM215.728 380.709L87.33 336.664l86.136-29.447c19.052 23.761 34.023 40.116 34.879 41.049a10.392 10.392 0 007.654 3.359c2.911 0 5.687-1.218 7.654-3.359.858-.935 15.871-17.338 34.965-41.155l86.051 29.519-128.941 44.079z"/>
            <path class="text-gray-400" fill="currentColor" d="M216.5 201c29.5 0 53.5-24 53.5-53.5S246 94 216.5 94 163 118 163 147.5s24 53.5 53.5 53.5zm32.682-53.5c0 18.021-14.66 32.682-32.682 32.682-18.022 0-32.682-14.66-32.682-32.682 0-18.02 14.66-32.682 32.682-32.682 18.022 0 32.682 14.662 32.682 32.682z"/>
          </svg>
        </div>
        <div class="mt-4 text-center space-y-2 text-gray-800">
          <h3 class="text-2xl leading-6 font-medium">Need you Location</h3>
          <p class="text-sm text-gray-700">
            Your location is required for accurate prayer time calculations.
          </p>
          {error ? <p class="text-xs text-gray-500">Error: {error}</p> : <span />}
        </div>
        <div class="text-center mt-5">
          <button x-on:click={askLocationPermission} type="button" class="bg-gray-50 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300">
            Allow Location
          </button>
        </div>
      </div>
    </div>
  );
}
