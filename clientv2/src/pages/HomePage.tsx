import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Github,
  Globe,
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectApi } from "@/lib/mockApi";
import { Project } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await projectApi.getProjects();
        setProjects(projectsData.slice(0, 6)); // Show only first 6 projects on homepage
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "winner":
        return "bg-gradient-accent text-accent-foreground";
      case "approved":
        return "bg-success text-success-foreground";
      case "reviewing":
        return "bg-warning text-warning-foreground";
      case "pending":
        return "bg-muted text-muted-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-primary px-4 py-2 rounded-full text-primary-foreground text-sm font-medium mb-4">
          <Trophy className="h-4 w-4" />
          <span>Hackathon Projects Showcase</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent animate-gradient-shift bg-300%">
            Hackathonia
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover innovative blockchain projects built by talented developers
          in our hackathon community. From DeFi to NFTs, explore the future of
          decentralized technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="hero" asChild>
            <Link to="/submission" className="flex items-center space-x-2">
              <span>Submit Your Project</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link to="/projects" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>View All Projects</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <Button variant="outline" asChild>
            <Link to="/projects">
              View All Projects
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to submit your innovative project to the hackathon!
              </p>
              <Button asChild>
                <Link to="/submission">Submit Your Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card
                key={project.id}
                className="group hover:shadow-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge
                      className={getStatusColor(project.status)}
                      variant="secondary"
                    >
                      {project.status}
                    </Badge>
                    {project.status === "winner" && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {project.projectTitle}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.projectSummary}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-mono text-xs truncate">
                        {project.ss58Address.slice(0, 8)}...
                        {project.ss58Address.slice(-6)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(project.submittedAt)}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.techStack
                        .split(",")
                        .slice(0, 3)
                        .map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech.trim()}
                          </Badge>
                        ))}
                      {project.techStack.split(",").length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.techStack.split(",").length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <div className="flex w-full gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link
                        to={`/project/${project.id}`}
                        className="flex items-center space-x-2"
                      >
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="flex gap-2">
                      {project.gitLink && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.gitLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}

                      {project.demoLink && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View Demo"
                          >
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
