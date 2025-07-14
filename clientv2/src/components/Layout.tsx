import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                © 2024 Blockspace Stadium. Built for hackers, by hackers.
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="https://github.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              <Link
                to="https://docs.polkadot.network"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </Link>
              <Link
                to="/submission"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Submit Project
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
