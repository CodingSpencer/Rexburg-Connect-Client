import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import EventCard from "../../components/EventCard.svelte";
import { render } from "@testing-library/svelte";

console.log(render.toString());


describe("EventCard", () => {
  it("renders", () => {
    const { container } = render(EventCard, {
      props: {
        event: {
          title: "Test",
          image: "",
          description: "",
          date: "",
          location: "",
          mongoId: "1",
          averageRating: 0
        }
      }
    });

    expect(container).toBeTruthy();
  });
});
