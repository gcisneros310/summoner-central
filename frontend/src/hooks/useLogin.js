const { useState } = require("react");
const { useAuthContext } = require("./useAuthContext");

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const dummyJSON = JSON.stringify({ email, password })
        console.log(dummyJSON)

        const response = await fetch("http://localhost:3001/api/user/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: dummyJSON,
        });

        const json = await response.json();

        console.log('JSON IN USELOGIN: ', json)

        
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

    return { login, error, isLoading}
}