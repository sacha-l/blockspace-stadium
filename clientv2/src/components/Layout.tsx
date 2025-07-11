import { Link, useLocation, Outlet } from "react-router-dom";
import { Code, Trophy, PlusCircle, Shield, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm shadow-elegant">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Blockspacebuilders
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center space-x-2">
                <span>Home</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/projects") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/projects" className="flex items-center space-x-2">
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/submission") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/submission" className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span>Submit</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/admin" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Trophy className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">
                <FolderOpen className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/submission">
                <PlusCircle className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <Shield className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 mt-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-gradient-primary rounded-md flex items-center justify-center">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                © 2024 Blockspacebuilders. Built for hackers, by hackers.
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
