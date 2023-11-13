<script>
  import { onMount, onDestroy } from "svelte";
  import { Html5Qrcode } from "html5-qrcode";

  let scanner = null;
  let code = "";
  let message = "";
  let error = "";
  let success = false;
  const scannerId = "scanner";
  const serverUrl = "https://okat.handoyonoterakhir34.workers.dev/";
  let camera = "environment";
  let useCamera = false;
  let position = { latitude: 0, longitude: 0 };
  let isWithin500Meters = false;
  const target = { lat: -7.569554249999999, lon: 110.770157 };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const adjustVideoSize = () => {
    const videoElem = document.querySelector(`#${scannerId} video`);
    if (videoElem) {
      const containerWidth = document.getElementById(scannerId).offsetWidth;
      const containerHeight = document.getElementById(scannerId).offsetHeight;

      videoElem.style.width = `${Math.min(containerWidth, 500)}px`;
      videoElem.style.height = `${Math.min(containerHeight, 500)}px`; // Sesuaikan angka 400 sesuai kebutuhan
    }
  };

  window.addEventListener("resize", adjustVideoSize);
  const startScanner = async () => {
    scanner = new Html5Qrcode(scannerId);
    try {
      await scanner.start(
        { facingMode: camera },
        { fps: 10, qrbox: 150 },
        (qrCodeMessage) => {
          code = qrCodeMessage;
          submitCode();
        }
      );
      adjustVideoSize();
    } catch (err) {
      error = err.message;
      console.error(err);
    }
  };

  const stopScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          scanner = null;
        })
        .catch((err) => {
          error = err.message;
          console.error(err);
        });
    }
  };

  const toggleCamera = async () => {
    useCamera = !useCamera;
    if (useCamera) {
      await startScanner();
    } else {
      stopScanner();
    }
  };

  onMount(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          position.latitude = pos.coords.latitude;
          position.longitude = pos.coords.longitude;
          const distance = calculateDistance(
            position.latitude,
            position.longitude,
            target.lat,
            target.lon
          );
          isWithin500Meters = distance <= 500;
        },
        (err) => {
          error = err.message;
          console.error(err);
        }
      );
    } else {
      console.log("Geolocation tidak didukung di browsermu");
    }
    if (useCamera) {
      await startScanner();
    }
  });

  onDestroy(() => {
    stopScanner();
  });

  const switchCamera = async () => {
    camera = camera === "environment" ? "user" : "environment";
    if (scanner) {
      stopScanner();
      await startScanner();
    }
  };

  const submitCode = async () => {
    if (!isWithin500Meters) {
      message =
        "Anda harus berada dalam radius 500 meter untuk dapat mengirim kode.";
      return;
    }
    try {
      const timezoneOffset = new Date().getTimezoneOffset() * -1; // in minutes

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          timestamp: new Date(),
          timezoneOffset,
          geolocation: `${position.latitude},${position.longitude}`,
        }),
      });
      const data = await response.json();
      message = data.message;
      code = "";
      success = true;
    } catch (err) {
      error = `Internet Bermasalah ${err.message}`;
      console.error(err);
    }
  };
</script>

<div
  id={scannerId}
  class="relative z-10 mt-15 mx-auto w-fit w-full max-w-[300px] max-h-[300px] h-full border-4 border-blue-500 shadow-lg rounded-lg"
  class:hidden={!useCamera}
  class:slide-down={useCamera}
  class:slide-up={!useCamera}
/>

<div
  class="flex flex-col items-center justify-center mx-auto w-fit p-5 bg-gray-100 rounded-md shadow-lg"
  class:mt-0={useCamera}
  class:mt-10={!useCamera}
>
  <div class="flex">
    <button
      on:click={toggleCamera}
      class="px-6 py-3 rounded-full outline-none relative overflow-hidden border duration-300 ease-linear
         after:absolute after:inset-x-0 after:aspect-square after:scale-0 after:opacity-70 after:origin-center after:duration-300 after:ease-linear after:rounded-full after:top-0 after:left-0 after:bg-[#172554]
         bg-primary border-transparent relative after:bg-[#172554] hover:border-[#172554] hover:after:opacity-100 hover:after:scale-[2.5]"
    >
      <span class="text-black relative z-[5]"
        >{useCamera ? "Stop Camera" : "Use Camera"}</span
      >
    </button>

    {#if useCamera}
      <button
        on:click={switchCamera}
        class="px-6 py-3 rounded-full outline-none relative overflow-hidden border duration-300 ease-linear
         after:absolute after:inset-x-0 after:aspect-square after:scale-0 after:opacity-70 after:origin-center after:duration-300 after:ease-linear after:rounded-full after:top-0 after:left-0 after:bg-[#172554]
         bg-primary border-transparent relative after:bg-[#172554] hover:border-[#172554] hover:after:opacity-100 hover:after:scale-[2.5]"
      >
        Switch Camera
      </button>
    {/if}
  </div>
  <form on:submit|preventDefault={submitCode} class="mt-4 space-y-3 mx-auto">
    <input
      type="text"
      bind:value={code}
      placeholder="Enter your unique code"
      required
      class="  px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
    />

    <button
      type="submit"
      class="px-6 py-3 rounded-full outline-none relative overflow-hidden border duration-300 ease-linear
      after:absolute after:inset-x-0 after:aspect-square after:scale-0 after:opacity-70 after:origin-center after:duration-300 after:ease-linear after:rounded-full after:top-0 after:left-0 after:bg-[#172554]
      bg-primary border-transparent relative after:bg-[#172554] hover:border-[#172554] hover:after:opacity-100 hover:after:scale-[2.5] undefined"
      ><span class="text-black relative z-[5]">Submit</span></button
    >
  </form>
  <div class="w-[70%] m-0 p-0 text-center font-bold" >
    <p class=" text-sm text-gray-600">{message}</p>
    <p class=" text-red-600" aria-live="polite">{error}</p></div>
  <p class="text-sm text-gray-600">
    Lokasi Kamu: {position.latitude}, {position.longitude}
  </p>
  <p class="text-sm text-gray-600 relative">
    Apakah Kamu berada di sekitar
    <span class="group relative hover:underline cursor-pointer" tabindex="0">
      kampus
      <span
        class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 z-10 py-1 px-3 text-sm text-white bg-black rounded shadow-lg"
      >
        Lipia Jakarta
      </span>
    </span>
    ?
    <span
      class="{isWithin500Meters ? 'text-green-500' : 'text-red-500'} font-bold"
    >
      {isWithin500Meters ? "Ya" : "Tidak"}
    </span>
  </p>

</div>

<style>
  @keyframes slide-down {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100%);
    }
  }

  .slide-down {
    animation: slide-down 0.5s ease-in-out forwards;
  }

  .slide-up {
    animation: slide-up 0.5s ease-in-out forwards;
  }
</style>
