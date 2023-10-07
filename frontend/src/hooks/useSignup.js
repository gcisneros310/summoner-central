const { useState } = require("react");
const { useAuthContext } = require("./useAuthContext");

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const signup = async (email, password, summonerName) => {
        setIsLoading(true);
        setError(null);

        console.log("useSignup email", email)
        console.log("useSignup password", password)
        console.log("useSignup summoner name", summonerName)

        const dummyJSON = JSON.stringify({ email, password, summonerName })

        console.log("useSignup dummyJSON", dummyJSON)

        const response = await fetch("http://localhost:3001/api/user/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: dummyJSON,
        });

        console.log("useSignup response", response)
        const json = await response.json();

        console.log("useSignup json", json)
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
            console.log(json.error)
        }
        else {
            
            // save the user to local storage
            localStorage.setItem("user", JSON.stringify(json));

            // update the auth context
            dispatch({ type: "LOGIN", payload: json });

            setIsLoading(false);
        }
    }

    return { signup, error, isLoading}
}