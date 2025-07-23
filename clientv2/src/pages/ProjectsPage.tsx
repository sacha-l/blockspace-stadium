import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Globe,
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  Loader2,
  ChevronLeft,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { projectApi } from "@/lib/mockApi";
import { Project } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const PROJECTS_PER_PAGE = 9;

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

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

  // Pagination logic
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold mb-2">All Projects</h1>
        <p className="text-muted-foreground">
          Browse all {projects.length} submitted hackathon projects
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to submit your innovative project to the hackathon!
            </p>
            <Button asChild>
              <Link to="/submission">Submit Your Milestone</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProjects.map((project, index) => (
              <Card
                key={project.ss58Address}
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
                  <CardDescription className="line-clamp-3 project-card-info">
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
                        to={`/project/${project.ss58Address}`}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
