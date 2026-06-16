import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

PROJECT_ID = "project-0ae56a62-0f0a-4d8a-9b7"
LOCATION = "us-central1"
MODEL_ID = "imagen-3.0-generate-002"

def generate_image_vertex(prompt: str, output_filename: str):
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = ImageGenerationModel.from_pretrained(MODEL_ID)
    print(f"Generating image: {prompt[:60]}...")
    images = model.generate_images(
        prompt=prompt,
        number_of_images=1,
        aspect_ratio="1:1",
        safety_filter_level="block_some"
    )
    images[0].save(location=output_filename, include_generation_parameters=False)
    print(f"Saved: {output_filename}")
    return output_filename

if __name__ == "__main__":
    import sys
    prompt = sys.argv[1] if len(sys.argv) > 1 else "A photorealistic red apple on a white marble table, soft studio lighting"
    out = sys.argv[2] if len(sys.argv) > 2 else "test_vertex_image.png"
    generate_image_vertex(prompt, out)
