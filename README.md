# Frontend Coding Interview Test

We recommend (although not required) to use the following languages, libraries, components: **TypeScript**, **React Query**, **Tailwind**, **shadcnUI**, and **Next.js Image component**.

## How to use

Clone using the following command:

```bash
git clone https://github.com/mmiro-balize/frontend-test.git
```

Navigate to the `frontend-test` directory and run the following command:

```bash
npm install
```

To run the project, use the following command:

```bash
npm run dev
```

## Requirements

1. **Fetch Pokémon Data:**

   - Use the Pokémon API endpoint: `https://pokeapi.co/api/v2/pokemon` to fetch a list of Pokémon.
   - The API returns a JSON object with the following structure:
     ```typescript
     {
       count: number; // Total number of Pokémon
       next: string | null; // URL for the next page of results
       previous: string | null; // URL for the previous page of results
       results: {
         name: string;
         url: string;
       }
       []; // List of Pokémon
     }
     ```

2. **Create Initial Data Table:**

   - Render the Pokémon in a data table with a single column:
     - **Name:** Display the name of the Pokémon.
   - At this stage, only the "Name" column should be populated since this is the only data available after the initial API fetch.

3. **Enhance Data Table with Additional Columns:**

   - For each Pokémon in the table, use the `url` provided in the `results` to fetch additional details from each Pokémon's individual endpoint.
   - - The API returns a JSON object with the following structure:
     ```typescript
     {
       id: number;
       sprites: {
         front_default: string;
       } // Image URLs
       types: {
         slot: number;
         type: {
           name: string;
         }
       }
       [];
     }
     ```
   - Add two new columns to the data table:
     - **Image (Sprite):** Fetch and display each Pokémon's image (sprite).
     - **Types:** Fetch and display each Pokémon's types.

4. **Pagination or Infinite Scroll:**
   - Implement either pagination or infinite scrolling to allow fetching and displaying the next set of Pokémon using the `next` property from the API response.
   - If pagination is chosen, provide controls to navigate between pages.
   - If infinite scrolling is chosen, automatically fetch and display the next set of Pokémon as the user scrolls down.
