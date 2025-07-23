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
import { ProjectDetailsDrawer } from "@/components/ProjectDetailsDrawer";

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await projectApi.getProjects();
        setProjects(projectsData);
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

  // Stats calculation
  const totalProjects = projects.length;
  const totalRewards = 100; // TODO: Replace with real value or calculation
  const totalTeams = new Set(projects.map(p => p.ss58Address)).size;

  // Winning projects (first 6)
  const winningProjects = projects.filter(p => p.status === "winner").slice(0, 6);

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
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">BlockSpace Stadium</h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground">Where Blockspace Builders Ship Betwen Hackathons</h2>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 text-lg font-mono">
        <span>{totalProjects} Projects Built</span>
        <span className="hidden sm:inline">|</span>
        <span>${totalRewards}K in Rewards</span>
        <span className="hidden sm:inline">|</span>
        <span>{totalTeams} Teams Shipping</span>
      </div>

      {/* Winning Projects Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Winning Projects</h2>
        {winningProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No Winning Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Winning projects will be displayed here as they are selected.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winningProjects.map((project, index) => (
              <Card
                key={project.ss58Address}
                className="group hover:shadow-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className="bg-gradient-accent text-accent-foreground" variant="secondary">
                      Winner
                    </Badge>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle className="capitalize group-hover:text-primary transition-colors">
                    {project.projectTitle}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 project-card-info">
                    {project.projectSummary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-mono text-xs truncate">
                        {project.ss58Address.slice(0, 8)}...{project.ss58Address.slice(-6)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(project.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
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
                      <Link to={`/project/${project.ss58Address}`} className="flex items-center space-x-2">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      {project.gitLink && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.gitLink} target="_blank" rel="noopener noreferrer" title="View on GitHub">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.demoLink && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={project.demoLink} target="_blank" rel="noopener noreferrer" title="View Demo">
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
      {/* View All Projects Button */}
      <div className="flex justify-center mt-8">
        <Button asChild size="lg">
          <Link to="/projects" className="flex items-center space-x-2">
            <span>View All Projects</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
