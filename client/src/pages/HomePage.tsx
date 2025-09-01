import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ChevronRight,
  Loader2,
  Play,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { DemoVideoModal } from "@/components/DemoVideoModal";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { getProjectUrl } from "@/lib/projectUtils";

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoProject, setVideoProject] = useState<any | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { toast } = useToast();
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Use API to fetch projects with proper IDs instead of static JSON
        const response = await api.getProjects({ 
          hackathonId: 'synergy-2025',
          limit: 100 // Get enough projects to find winners
        });
        
        // Extract projects from the API response structure
        const apiProjects = response.data || [];
        console.log('Loaded projects from API:', apiProjects.length);
        
        setProjects(apiProjects);
      } catch (error) {
        console.error('Failed to load projects from API:', error);
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

  const totalProjects = projects.length;
  const totalRewards = 40;
  const totalTeams = new Set(projects.map((p: any) => p.teamLead)).size;
  
  // Filter for winning projects based on bountyPrize (API response structure)
  const winningProjects = projects.filter((p: any) => 
    p.bountyPrize && Array.isArray(p.bountyPrize) && p.bountyPrize.length > 0
  ).slice(0, 9);

  // Carousel navigation
  const prevCard = () => setCarouselIndex((i) => (i - 1 + winningProjects.length) % winningProjects.length);
  const nextCard = () => setCarouselIndex((i) => (i + 1) % winningProjects.length);

  // Drag/swipe logic
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -80) {
      nextCard();
    } else if (info.offset.x > 80) {
      prevCard();
    }
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
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 break-words whitespace-pre-line leading-tight">
          Blockspace Stadium
        </h1>
      </div>
      {/* Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 text-lg font-mono">
        <span className="w-full text-center font-pressStart text-base sm:text-lg text-gray-300 tracking-wide mt-2 block" style={{ textShadow: '0 2px 8px #8888' }}>
          A Blockspace Builder's project progress and showcase portal.
        </span>
      </div>

      {/* Winning Projects Carousel */}
      <div className="mb-8 flex flex-col items-center">
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
          <div className="relative w-full flex items-center justify-center min-h-[420px] md:min-h-[520px]">
            <div className="flex items-center justify-center w-full relative" style={{ minHeight: '400px' }}>
              {/* Carousel Cards */}
              {[-1, 0, 1].map((offset) => {
                const idx = (carouselIndex + offset + winningProjects.length) % winningProjects.length;
                const project = winningProjects[idx] as any;
                let scale = 1, opacity = 1, zIndex = 10, translateX = 0, rotateY = 0, blur = "";
                if (offset === 0) {
                  scale = 1;
                  opacity = 1;
                  zIndex = 30;
                  translateX = 0;
                  rotateY = 0;
                  blur = "";
                } else if (offset === -1) {
                  scale = 0.85;
                  opacity = 0.6;
                  zIndex = 20;
                  translateX = -180; // Reduced for mobile
                  rotateY = 20;
                  blur = "blur-sm";
                } else if (offset === 1) {
                  scale = 0.85;
                  opacity = 0.6;
                  zIndex = 20;
                  translateX = 180; // Reduced for mobile
                  rotateY = -20;
                  blur = "blur-sm";
                }
                return (
                  <motion.div
                    key={project.projectName + offset}
                    initial={{ opacity: 0, scale: 0.8, x: 0 }}
                    animate={{
                      opacity,
                      scale,
                      x: translateX,
                      zIndex,
                      rotateY,
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`absolute w-full max-w-sm md:max-w-lg ${blur} ${offset === 0 ? "shadow-2xl border-2 border-purple-500/50" : ""}`}
                    style={{ perspective: 1000, pointerEvents: offset === 0 ? "auto" : "none" }}
                    drag={offset === 0 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={offset === 0 ? handleDragEnd : undefined}
                  >
                    <Card
                      className={`group transition-all duration-300 animate-fade-in ${offset === 0 ? 'hover:shadow-2xl hover:scale-105 animate-float' : ''}`}
                      style={offset === 0 ? { animation: 'float 6s ease-in-out infinite' } : {}}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-col gap-1">
                            <Badge 
                              className={`${
                                project.winner?.toLowerCase().includes('kusama') 
                                  ? 'bg-purple-600/20 text-purple-300 border-purple-600/30' 
                                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                              }`} 
                              variant="secondary"
                            >
                              🏆 {project.winner
                                ? project.winner
                                    .split(' ')
                                    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                    .join(' ')
                                : ''}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/30">
                              Blockspace Synergy 2025
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="capitalize group-hover:text-primary transition-colors text-lg">
                          {project.projectName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-xs">
                            {project.teamLead}
                          </span>
                        </div>
                      </CardContent>
                      <CardContent className="pt-0 pb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.techStack && project.techStack !== "" && (
                            <Badge variant="outline" className="text-xs">
                              {project.techStack}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full md:flex-1 text-muted-foreground hover:text-primary bg-gray-100/10 border-gray-300/30"
                            onClick={() => setVideoProject(project)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            <span>View Demo</span>
                          </Button>
                                                                                <Button asChild size="sm" variant="outline" className="w-full md:flex-1 text-muted-foreground hover:text-primary bg-gray-100/10 border-gray-300/30">
                             <Link to={getProjectUrl(project)} className="flex items-center justify-center space-x-2">
                               <span>Project Page</span>
                               <ChevronRight className="h-4 w-4" />
                             </Link>
                           </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
              {/* Left Arrow (flush with card) */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20"
                onClick={prevCard}
                disabled={winningProjects.length < 2}
                aria-label="Previous project"
              >
                <ArrowLeft className="h-8 w-8 text-muted-foreground" />
              </Button>
              {/* Right Arrow (flush with card) */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20"
                onClick={nextCard}
                disabled={winningProjects.length < 2}
                aria-label="Next project"
              >
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* View All Projects Button */}
      <div className="flex justify-center mt-8">
        <Button asChild size="lg" className="hover:bg-accent hover:text-accent-foreground transition-colors">
          <Link to="/past-projects" className="flex items-center space-x-2">
            <span>View All Past Projects</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {/* Video Modal */}
      <DemoVideoModal open={!!videoProject} onClose={() => setVideoProject(null)} project={videoProject} />
    </div>
  );
};

export default HomePage;
