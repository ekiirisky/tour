document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll("nav ul li a");
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");

    // Fungsi untuk scroll dengan smooth
    function scrollToTarget(targetId) {
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Cek apakah sudah berada di section yang sama untuk mencegah scroll ulang
            const currentScroll = window.scrollY;
            const targetScroll = targetSection.offsetTop - 50;

            if (Math.abs(currentScroll - targetScroll) < 5) return; // Jika posisi hampir sama, jangan scroll ulang

            window.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            });

            // Update hash setelah scroll selesai
            setTimeout(() => {
                if (window.location.hash !== `#${targetId}`) {
                    history.pushState(null, null, `#${targetId}`);
                }
            }, 300);
        }
    }

    navItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            const targetHref = this.getAttribute("href");
            const isSamePage = targetHref.startsWith("#");
            const isTourActivityPage = window.location.pathname.includes("tour_activity.html");

            if (isSamePage && isTourActivityPage) {
                e.preventDefault();
                const targetId = targetHref.substring(1);
                scrollToTarget(targetId);
            } 
            else if (targetHref.includes("tour_activity.html#tours") || targetHref.includes("tour_activity.html#activities")) {
                e.preventDefault();
                const sectionID = targetHref.split("#")[1];

                // Arahkan ke tour_activity.html dengan parameter scrollTo
                window.location.href = `tour_activity.html?scrollTo=${sectionID}`;
            } 
            else {
                window.location.href = targetHref;
            }
        });
    });

    // Auto-scroll ke section setelah pindah ke tour_activity.html
    function scrollToSectionFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const scrollTo = urlParams.get("scrollTo");

        if (scrollTo) {
            setTimeout(() => {
                scrollToTarget(scrollTo);
                history.replaceState(null, null, `tour_activity.html#${scrollTo}`);
            }, 500);
        }
    }

    scrollToSectionFromURL();

    // Cegah scroll ulang jika hash sudah sama
    window.addEventListener("hashchange", function () {
        const targetId = location.hash.substring(1);
        scrollToTarget(targetId);
    });

    // Menghilangkan navbar saat mencapai footer
    function handleScroll() {
        if (footer) {
            const footerPosition = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (footerPosition <= windowHeight) {
                navbar.style.opacity = "0"; 
                navbar.style.pointerEvents = "none"; 
            } else {
                navbar.style.opacity = "1";
                navbar.style.pointerEvents = "auto";
            }
        }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
});
