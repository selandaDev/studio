
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddContentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Content</CardTitle>
          <CardDescription>Fill out the form to add a new movie, series, or music album to your library.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid gap-3">
                <Label htmlFor="type">Content Type</Label>
                <Select>
                    <SelectTrigger id="type" aria-label="Select content type">
                        <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="series">TV Series</SelectItem>
                        <SelectItem value="music">Music Album</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input id="title" type="text" placeholder="e.g., The Grand Adventure" />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="A brief summary of the content." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-3">
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" type="text" placeholder="e.g., Sci-Fi" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="year">Release Year</Label>
                    <Input id="year" type="number" placeholder="e.g., 2024" />
                </div>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="path">File Path or Folder</Label>
                <Input id="path" type="text" placeholder="/path/to/your/media/file_or_folder" />
                <p className="text-sm text-muted-foreground">
                    This is a simulation. In a real app, you would browse for a file.
                </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="url">Content URL (Optional)</Label>
                <Input id="url" type="url" placeholder="https://www.youtube.com/watch?v=..." />
                 <p className="text-sm text-muted-foreground">
                    e.g., YouTube, Vimeo, or a direct file link (.mp4, .mp3).
                </p>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="ml-auto">Add to Library</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
