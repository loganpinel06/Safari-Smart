export default async function Page({
  params,
}: {
  params: { categoryID: string };
}) {
  const response = await fetch(
    `https://localhost:3000/api/category/${params.categoryID}`,
  );
  const { categories, message, error } = await response.json();

  return (
    <div>
      <p>Welcome to Safari Smart</p>
    </div>
  );
}
