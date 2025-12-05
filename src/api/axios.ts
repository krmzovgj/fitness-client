import axios from "axios";

export const api = axios.create({
    baseURL: "https://fitness-server-flax.vercel.app",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});
