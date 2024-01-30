export function isLocal() {
    const LOCAL_KEY = "LOCAL";
    const local = localStorage.getItem(LOCAL_KEY);
    return local !== null;
}
