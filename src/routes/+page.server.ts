export async function load({ fetch }) {
    let response = await fetch('/api/messages');
    let data = await response.json();
    return {
        messages: data
    }
}