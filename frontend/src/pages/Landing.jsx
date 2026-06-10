import { Link } from "react-router-dom";

function Landing() {
    return (
        <div
            className="
            flex flex-col
            min-h-screen
            items-center
            justify-center
            bg-slate-950
            gap-6"
        >
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white tracking-tight">
                    Appli<span className="text-indigo-500">Track</span>
                </h1>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <Link
                    to="/login"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-lg font-semibold transition-colors"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="border border-indigo-500 text-indigo-400 hover:bg-indigo-950 text-center py-3 rounded-lg font-semibold transition-colors"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}

export default Landing;
