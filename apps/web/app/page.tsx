import { ThemeToggle } from "@repo/ui/components/custom/ThemeToggle";
import Link from "next/link";

const visualizations = [
  {
    href: "/knn",
    src: "/placeholder.svg",
    alt: "K-Nearest Neighbors",
    title: "K-Nearest Neighbors",
    description: "Explore the K-Nearest Neighbors algorithm in 3D.",
  },
  {
    href: "/kmeans",
    src: "/placeholder.svg",
    alt: "K-Means Clustering",
    title: "K-Means Clustering",
    description: "Visualize the K-Means Clustering algorithm in 3D.",
  },
  {
    href: "/linear-regression",
    src: "/placeholder.svg",
    alt: "Linear Regression",
    title: "Linear Regression",
    description: "Visualize the Linear Regression algorithm in 3D.",
  },
  {
    href: "/autoencoder",
    src: "/placeholder.svg",
    alt: "Autoencoder",
    title: "Autoencoder",
    description: "Understand the inner workings of autoencoders.",
  },
  {
    href: "/ffnn",
    src: "/placeholder.svg",
    alt: "Neural Network Visualization",
    title: "Neural Network Visualization",
    description: "Dive into the inner workings of neural networks.",
  },
  {
    href: "/svm",
    src: "/placeholder.svg",
    alt: "Support Vector Machine Visualization",
    title: "Support Vector Machine",
    description: "Explore the power of support vector machines.",
  },
];

export default function Page() {
  return (
    <div className="w-full">
      <ThemeToggle className="fixed top-0 right-0 m-4" />
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container px-4 mx-auto md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              AI Algorithm Visualizations
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Explore a collection of interactive 3D visualizations that bring
              AI algorithms to life.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container grid gap-8 px-4 mx-auto md:grid-cols-2 lg:grid-cols-3 md:px-6">
          {visualizations.map((viz, index) => (
            <Link
              key={index}
              href={viz.href}
              className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-primary"
              prefetch={false}
            >
              {/* <img
                src={viz.src}
                alt={viz.alt}
                width="400"
                height="300"
                className="object-cover w-full h-64 group-hover:opacity-50 transition-opacity"
                style={{ aspectRatio: "400/300", objectFit: "cover" }}
              /> */}
              <div className="py-6 bg-card inset-0 z-10 flex items-center justify-center">
                <div className="text-center text-card-foreground">
                  <h3 className="text-xl font-bold">{viz.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {viz.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
