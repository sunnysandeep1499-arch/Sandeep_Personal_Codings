// Prefill form if data exists
window.onload = function () {
    const saved = JSON.parse(localStorage.getItem("details"));
    if (saved) {
        const [title, ...rest] = saved.name.split(" ");
        document.getElementById("title").value = title || "";
        document.getElementById("name").value = rest.join(" ") || "";
        document.getElementById("phone").value = saved.phone || "";
        document.getElementById("location").value = saved.location || "";
        document.getElementById("points").value = saved.points || "";
    }
};

function previewDetails() {
    const title = document.getElementById("title").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const location = document.getElementById("location").value;
    const points = document.getElementById("points").value;

    if (!name || !phone || !location || !points) {
        alert("Please fill in all fields before previewing!");
        return;
    }

    const details = { title, name, phone, location, points };
    localStorage.setItem("details", JSON.stringify(details));

    document.getElementById("preview").style.display = "block";
    document.getElementById("preview").innerHTML = `
        <h3>Preview Details:</h3>
        <p><strong>Name:</strong> ${title} ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Praise/Prayer Points:</strong> ${points}</p>
        <button onclick="editDetails()">Edit</button>
        <button onclick="submitDetails()">Submit</button>
    `;
}

function editDetails() {
    document.getElementById("preview").style.display = "none";
    // Form fields remain filled because of localStorage
}

async function submitDetails() {
    const details = JSON.parse(localStorage.getItem("details"));
    if (!details) {
        alert("Please preview your details before submitting!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/saveDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(details)
        });

        if (response.ok) {
            alert("✅ Details submitted successfully!");
            localStorage.removeItem("details"); // clear only after success
        } else {
            alert("❌ Error submitting details!");
        }
    } catch (err) {
        console.error(err);
        alert("⚠️ Failed to connect to backend!");
    }
}