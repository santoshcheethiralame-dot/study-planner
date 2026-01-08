"use client";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function SubjectsSetupPage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <Card className="space-y-6">
                    {/* Header */}
                    <div className="space-y-1">
                        <h1 className="text-lg font-semibold text-neutral-900">
                            Subjects setup
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Add the subjects you are studying this semester
                        </p>
                    </div>

                    {/* Form (UI only for now) */}
                    <div className="space-y-4">
                        <Input
                            label="Subject name"
                            placeholder="Data Structures"
                        />

                        <Input
                            label="Credits"
                            placeholder="4"
                            type="number"
                        />

                        <Input
                            label="Difficulty"
                            placeholder="Easy / Medium / Hard"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button variant="secondary" className="w-full">
                            Add subject
                        </Button>

                        <Button className="w-full">
                            Continue
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
