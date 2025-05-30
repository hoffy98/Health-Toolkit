type Props = {}

export default function Home({}: Props) {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center mx-auto max-w-md">
      <h1>Health-Toolkit</h1>
      <p className="p-5 text-center">
        toolkit.health is a collection of tools related to physical and mental health
      </p>
      <p className="opacity-20">by Johannes Hofmann</p>
      <hr className="my-10" />
    </div>
  )
}
