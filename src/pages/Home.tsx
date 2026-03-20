import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left Section */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-900">
            Welcome to Your Authentication Portal
          </h1>

          <p className="max-w-prose text-lg text-blue-700">
            Experience a seamless, secure, and modern authentication flow.
            Register, log in, and manage your profile with ease.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/register">
              <Button className="shadow-lg transition-transform duration-200 hover:scale-105">
                Get Started
              </Button>
            </Link>

            <Link to="/login">
              <Button
                variant="secondary"
                className="shadow-md transition-transform duration-200 hover:scale-105"
              >
                I already have an account
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <Card className="p-8 bg-white/80 shadow-xl backdrop-blur">
          <div className="space-y-6">
            <div className="text-lg font-semibold text-blue-900">
              Quick Tips
            </div>

            <ul className="space-y-3 text-md text-blue-700">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>
                  API base URL is set in{" "}
                  <code className="px-2 py-1 rounded bg-blue-100">
                    src/utils/api.ts
                  </code>
                  .
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>
                  Forms include accessible labels, focus rings, and inline error
                  messages.
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Fully responsive design with smooth transitions.</span>
              </li>

              <li className="flex gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>
                  Shared layout is in{" "}
                  <code className="px-1 rounded bg-slate-100">
                    src/components/layout
                  </code>
                  .
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
