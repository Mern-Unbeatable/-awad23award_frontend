declare global {
  interface Window {
    Swal?: any;
  }
}

async function getSwal(): Promise<any> {
  if (window.Swal) return window.Swal;

  return new Promise((resolve) => {
    if (!document.getElementById('sweetalert2-css')) {
      const link = document.createElement('link');
      link.id = 'sweetalert2-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('sweetalert2-js')) {
      const script = document.createElement('script');
      script.id = 'sweetalert2-js';
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      script.onload = () => resolve(window.Swal);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    } else {
      const check = setInterval(() => {
        if (window.Swal) {
          clearInterval(check);
          resolve(window.Swal);
        }
      }, 50);
    }
  });
}

export async function confirmDelete(
  title = 'Are you sure?',
  text = "You won't be able to revert this!"
): Promise<boolean> {
  const Swal = await getSwal();
  if (!Swal) {
    return window.confirm(`${title}\n${text}`);
  }

  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#64748B',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'rounded-lg px-4 py-2 font-semibold text-sm cursor-pointer',
      cancelButton: 'rounded-lg px-4 py-2 font-semibold text-sm cursor-pointer',
    },
  });

  return Boolean(result.isConfirmed);
}

export async function showSuccessToast(title: string) {
  const Swal = await getSwal();
  if (!Swal) return;
  Swal.fire({
    icon: 'success',
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}
