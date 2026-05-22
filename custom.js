document.getElementById("customForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let size = document.querySelector('input[name="size"]:checked');
    let type = document.querySelector('input[name="type"]:checked');
    let desc = document.getElementById("description").value.trim();

    let valid = true;

    // reset errors
    document.getElementById("sizeError").innerText = "";
    document.getElementById("typeError").innerText = "";
    document.getElementById("descError").innerText = "";

    if (!size) {
        document.getElementById("sizeError").innerText = "Please select a size";
        valid = false;
    }

    if (!type) {
        document.getElementById("typeError").innerText = "Please select a type";
        valid = false;
    }

    if (desc === "") {
        document.getElementById("descError").innerText = "Please enter a description";
        valid = false;
    }

    if (valid) {

        // ✅ SAME STRUCTURE AS YOUR BUY LINK
        const message = encodeURIComponent(
            `Hello! I want to request a custom craft:\n\n` +
            `Size: ${size.value}\n` +
            `Type: ${type.value}\n` +
            `Description: ${desc}\n\n` +
            `I will send a photo reference if needed.`
        );

        // ✅ SAME FB LINK SYSTEM
        const fbLink = `https://m.me/100086702227778?text=${message}`;

        // ✅ REDIRECT (same behavior as clicking a link)
        window.location.href = fbLink;

        // optional reset
        this.reset();
    }
});