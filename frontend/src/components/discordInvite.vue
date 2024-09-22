<template>
    <div class="discord-invite-box">
        <div class="discord-logo">
            <img src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6257d23c5fb25be7e0b6e220_Open%20Source%20Projects%20_%20Discord-7.svg" alt="Discord Logo">
        </div>
        <div class="invite-details">
            <h2>Join Our Official Discord Community</h2>
            <p>Connect with us directly and share your ideas or suggestions for improvement. If you'd like to upgrade your account to unlock additional features, such as posting with year-only or period-specific tags, you can request it here. Our Discord server is also the best place to make queries and contact our team for any support you need.</p>
            <a href="https://discord.gg/pg9rCfSb" class="discord-button" target="_blank">Join Now</a>
        </div>
    </div>
</template>

<style scoped>
.discord-invite-box {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2a56f3, #5865f2, #5267b4); /* Color gradient */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    max-width: 1000px; /* Reduced width for better fit */
    margin: 20px auto;
    color: #fff; /* Text color to contrast against gradient */
}

.discord-logo img {
    width: 120px; /* Smaller logo size */
    height: 50px;
    margin-right: 15px; /* Slightly reduced margin */
}

.invite-details {
    flex-grow: 1;
    font-size: 0.9em; /* Reduced text size for smaller screens */
}

.invite-details h2 {
    margin: 0;
    font-size: 1.5em; /* Slightly smaller heading */
    color: #fff;
}

.invite-details p {
    margin: 8px 0; /* Reduced margin */
    font-size: 0.95em; /* Smaller text */
    color: #e3e3e3;
}

.discord-button {
    display: inline-block;
    padding: 10px 20px; /* Reduced padding */
    background-color: #2b338c;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    font-size: 0.95em; /* Smaller button text */
}

.discord-button:hover {
    background-color: #011046;
    transform: translateY(-2px); /* Slight lift effect on hover */
}

/* Media Query for Mobile Devices */
@media screen and (max-width: 768px) {
    .discord-invite-box {
        flex-direction: column; /* Stack logo on top */
        align-items: center;
        text-align: center;
        padding: 15px;
        min-width: 280px;
        max-width: 375px;
    }

    .discord-logo img {
        margin: 0 0 15px 0; /* Margin for spacing below the logo */
        width: 100px; /* Even smaller logo */
        height: 40px;
    }

    .invite-details h2 {
        font-size: 1.2em; /* Smaller heading on mobile */
    }

    .invite-details p {
        font-size: 0.85em; /* Smaller text on mobile */
    }

    .discord-button {
        padding: 8px 16px; /* Reduced padding for mobile */
        font-size: 0.9em; /* Smaller button text */
    }
}
</style>
