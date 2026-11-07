const backendhttp = "http://localhost:3000";

export function getHistory(station){
    return fetch(`${backendhttp}/status/get?station=${station}`, {method:'GET'})
        .then((res) => {
            return res.json();
        }
    )
}