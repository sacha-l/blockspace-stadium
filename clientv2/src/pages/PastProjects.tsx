import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Globe, Users, Calendar, ChevronLeft } from "lucide-react";
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
import pastProjects from "@/data/pastProjects.json"; // Import your JSON data

interface PastProject {
  projectName: string;
  teamLead: string;
  description: string;
  eventStartedAt: string;
  githubRepo: string;
  demoUrl: string;
  slidesUrl: string;
  techStack: string;
  milestones: string[];
}

const PROJECTS_PER_PAGE = 9;

const PastProjectsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projects: PastProject[] = pastProjects;

  const formatDate = (dateString: string) => {
    if (dateString === "nan") return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
        <h1 className="text-4xl font-bold mb-2">Past Projects</h1>
        <p className="text-muted-foreground">
          Browse {projects.length} projects from previous hackathons
        </p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No Past Projects</h3>
            <p className="text-muted-foreground mb-4">
              Check back later for projects from upcoming hackathons
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProjects.map((project, index) => (
              <Card
                key={`${project.projectName}-${index}`}
                className="hover:shadow-muted transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    {project.projectName}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="truncate">By {project.teamLead}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Event: {project.eventStartedAt}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.techStack
                        .split(",")
                        .map((tech) => tech.trim())
                        .filter((tech) => tech && tech.toLowerCase() !== "nan")
                        .slice(0, 4)
                        .map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex justify-end gap-2">
                  {project.githubRepo.toLowerCase() !== "nan" && (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {project.demoUrl.toLowerCase() !== "nan" && (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Demo"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
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

export default PastProjectsPage;
