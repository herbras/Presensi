<script>
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
    let uniqueCode = '';
    let countdown = 0;
    let qrCodeDataUrl = '';
  
    onMount(() => {
      const fetchCode = async () => {
        const response = await fetch('https://okat.handoyonoterakhir34.workers.dev/');
        const data = await response.json();
        uniqueCode = data.code;
  
        // Generate QR code data URL
        qrCodeDataUrl = await QRCode.toDataURL(uniqueCode, { scale: 10 });
  
        // Hitung jumlah detik sampai menit berikutnya
        const secondsToNextMinute = 60 - new Date().getSeconds();
  
        // Atur countdown
        countdown = secondsToNextMinute;
  
        // Atur timeout untuk fetch code lagi di menit berikutnya
        setTimeout(fetchCode, secondsToNextMinute * 1000);  // Konversi detik ke milidetik
      };
  
      const startCountdown = () => {
        countdown -= 1;
  
        if (countdown <= 0) {
          countdown = 60;
        }
  
        setTimeout(startCountdown, 1000);
      };
    
      // Fetch code for the first time
      fetchCode();
  
      // Start countdown
      startCountdown();
    });
  </script>
    <section class="container mx-auto text-center">
        <div class="text-gray-900 dark:text-white">
          <div class="inline-block relative group overflow-hidden shadow-lg rounded-lg mx-auto">
            <img src={qrCodeDataUrl} alt="QR Code" class="object-contain h-64 sm:h-80 lg:h-96 transition duration-300 ease-linear group-hover:opacity-75" />
            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-70 transition duration-300 ease-linear"></div>
          </div>

          <h3 class="text-lg font-bold sm:text-2xl mb-2 mt-4">
            Kode Unik Presensi:
          </h3>
          <div class="inline-block overflow-hidden relative rounded-full bg-primary shadow-lg mx-auto">
            <span class="text-5xl font-extrabold text-black dark:text-amber px-6 py-3 block">
              {uniqueCode}
            </span>
          </div>

          <p class="max-w-sm mt-2 mx-auto">
            Updating in: <span class="font-bold">{countdown}</span> seconds
          </p>
        </div>
      </section>