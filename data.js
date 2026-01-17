const patternData = {
    intro: {
        title: "Agent Architecture Patterns",
        description: "A comprehensive guide to building multi-agent systems.",
        content: `
        <span class="badge exp">Experimental Features</span>
        <h1>Agent Architecture Patterns</h1>
        <p class="lead">A comprehensive guide to building multi-agent systems using Semantic Kernel and CrewAI.</p>
        
        <div class="analogy-box">
            <div class="analogy-title">💡 Why Orchestration?</div>
            <p>Single agents are like solo musicians—talented, but limited in scope. <strong>Orchestration</strong> allows you to become the conductor, coordinating multiple agents (musicians) to create a symphony. By combining specialized skills, you build systems that are robust, adaptive, and capable of solving complex real-world problems.</p>
        </div>

        <h2>The Pattern Catalog</h2>
        <div class="scenario-grid">
            <div class="scenario-card" onclick="showMainTab('sequential')" style="cursor:pointer">
                <h3>🔗 Sequential</h3>
                <p>A step-by-step pipeline. The output of one agent becomes the input of the next.</p>
            </div>
            <div class="scenario-card" onclick="showMainTab('concurrent')" style="cursor:pointer">
                <h3>⚡ Concurrent</h3>
                <p>Run agents in parallel. Best for brainstorming, voting, or gathering independent perspectives quickly.</p>
            </div>
            <div class="scenario-card" onclick="showMainTab('groupchat')" style="cursor:pointer">
                <h3>💬 Group Chat</h3>
                <p>Collaborative conversation managed by a moderator. Great for debate and consensus.</p>
            </div>
            <div class="scenario-card" onclick="showMainTab('handoff')" style="cursor:pointer">
                <h3>🤝 Handoff</h3>
                <p>Route users to the right expert. The "Call Center" model of AI.</p>
            </div>
            <div class="scenario-card" onclick="showMainTab('magentic')" style="cursor:pointer">
                <h3>🧠 Magentic</h3>
                <p>Autonomous planning. A manager breaks down complex open-ended tasks.</p>
            </div>
        </div>`
    },
    sequential: {
        title: "Sequential Orchestration",
        description: "A chain of responsibility where agents pass work down the line. Ideal for strict workflows.",
        analogy: {
            title: "Real World Analogy: The Assembly Line",
            text: "Think of a car factory. Robot A welds the frame. Robot B paints it. Robot C installs the glass. Robot C cannot do its job until Robot B is finished. Each step adds value to the previous step's output."
        },
        examples: [
            {
                id: "seq-ex1",
                title: "Example 1: Marketing Pipeline",
                intro: "<strong>Goal:</strong> Transform raw product specs into a polished marketing email.",
                steps: [
                    { title: "The Extractor", text: "First, we need an agent to clean the messy input. It reads raw specs and outputs structured key points." },
                    { title: "The Writer", text: "This agent takes the <em>Key Points</em> from the previous step (not the raw specs) and drafts a creative email." },
                    { title: "The Editor", text: "Finally, the editor reviews the draft for tone and grammar, producing the final output." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, SequentialOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama) via OpenAI Connector
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    # 2. Define Specialist Agents
    extractor = ChatCompletionAgent(
        name="Extractor",
        instructions="Extract key features from the raw input.",
        service=service
    )
    writer = ChatCompletionAgent(
        name="Writer",
        instructions="Write a compelling marketing email based on the features.",
        service=service
    )
    editor = ChatCompletionAgent(
        name="Editor",
        instructions="Fix grammar and improve flow.",
        service=service
    )

    # 3. Create Pipeline
    pipeline = SequentialOrchestration(members=[extractor, writer, editor])

    # 4. Invoke the orchestration
    print("Running Marketing Pipeline...")
    result = await pipeline.invoke(
        task="Raw specs for 'EcoBottle': Stainless steel, 24h cold, app tracking.",
        runtime=runtime
    )

    # 5. Get and print result
    output = await result.get()
    print(f"\nFinal Marketing Copy:\n{output}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai crewai-tools",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
# 1. OpenAI
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"

# 2. Ollama / VLLM (Local)
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_API_KEY"] = "NA"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

# 2. Define Specialist Agents
extractor = Agent(
    role='Extractor',
    goal='Extract key features from raw input',
    backstory='You are a marketing analyst proficient in technical specs.',
    verbose=True
)

writer = Agent(
    role='Writer',
    goal='Write a compelling email based on features',
    backstory='You are a creative copywriter.',
    verbose=True
)

editor = Agent(
    role='Editor',
    goal='Fix grammar and improve flow',
    backstory='You are a senior editor with an eye for detail.',
    verbose=True
)

# 3. Define Tasks (Sequential)
task1 = Task(
    description='Analyze the raw specs: "{topic}". Extract key points.',
    expected_output='A list of key features.',
    agent=extractor
)

task2 = Task(
    description='Write a marketing email using the extracted features.',
    expected_output='A draft email.',
    agent=writer
)

task3 = Task(
    description='Review the email draft for tone and grammar.',
    expected_output='Final polished email.',
    agent=editor
)

# 4. Create Crew
crew = Crew(
    agents=[extractor, writer, editor],
    tasks=[task1, task2, task3],
    process=Process.sequential
)

# 5. Execute
print("Running Marketing Pipeline...")
result = crew.kickoff(inputs={'topic': 'EcoBottle: Stainless steel, 24h cold, app tracking.'})
print(f"\nFinal Marketing Copy:\n{result}")`
                    }
                ]
            },
            {
                id: "seq-ex2",
                title: "Example 2: Software Dev Lifecycle",
                intro: "<strong>Goal:</strong> Convert a feature request into tested code.",
                steps: [
                    { title: "The Architect", text: "Reads the user request and writes a technical implementation spec." },
                    { title: "The Coder", text: "Takes the technical spec and writes the actual Python code." },
                    { title: "The Reviewer", text: "Reads the code, checks for security flaws, and outputs the final approved code block." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, SequentialOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    architect = ChatCompletionAgent(
        name="Architect",
        instructions="Create a technical spec for this feature request.",
        service=service
    )
    coder = ChatCompletionAgent(
        name="Coder",
        instructions="Write Python code based on the provided spec.",
        service=service
    )
    reviewer = ChatCompletionAgent(
        name="Reviewer",
        instructions="Review the code for security issues and Pythonic style.",
        service=service
    )

    pipeline = SequentialOrchestration(members=[architect, coder, reviewer])

    result = await pipeline.invoke(
        task="Feature: Add a rate limiter to the API.",
        runtime=runtime
    )

    output = await result.get()
    print(f"\nFinal Implementation:\n{output}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/codellama"
# ------------------------------

# Agents
architect = Agent(
    role='Software Architect',
    goal='Design robust software systems',
    backstory='Senior architect with 20 years experience.',
    verbose=True
)

coder = Agent(
    role='Senior Python Engineer',
    goal='Write clean, efficient Python code',
    backstory='Expert in Python and Algorithms.',
    verbose=True
)

reviewer = Agent(
    role='Code Reviewer',
    goal='Ensure code quality and security',
    backstory='Strict QA engineer.',
    verbose=True
)

# Tasks
task1 = Task(
    description='Create a technical spec for: "{feature}".',
    expected_output='Technical specification document.',
    agent=architect
)

task2 = Task(
    description='Write Python code based on the spec.',
    expected_output='Python code block.',
    agent=coder
)

task3 = Task(
    description='Review the code for security and style. Fix if needed.',
    expected_output='Final approved code.',
    agent=reviewer
)

# Crew
crew = Crew(
    agents=[architect, coder, reviewer],
    tasks=[task1, task2, task3],
    process=Process.sequential
)

# Execute
result = crew.kickoff(inputs={'feature': 'Add a rate limiter to the API.'})
print(f"\nFinal Implementation:\n{result}")`
                    }
                ]
            },
            {
                id: "seq-ex3",
                title: "Example 3: Data Science Pipeline",
                intro: "<strong>Goal:</strong> Automate data preprocessing and analysis.",
                steps: [
                    { title: "Loader", text: "Simulates loading raw CSV data." },
                    { title: "Cleaner", text: "Removes null values and formats columns." },
                    { title: "Analyzer", text: "Calculates statistical insights (mean, median) from the clean data." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, SequentialOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    loader = ChatCompletionAgent(
        name="Loader",
        instructions="You simulate loading data. Output a mock CSV string.",
        service=service
    )
    cleaner = ChatCompletionAgent(
        name="Cleaner",
        instructions="You receive CSV data. 'Clean' it by removing bad rows and output the clean CSV.",
        service=service
    )
    analyzer = ChatCompletionAgent(
        name="Analyzer",
        instructions="You receive clean CSV data. Calculate mean/median and return a text summary.",
        service=service
    )

    pipeline = SequentialOrchestration(members=[loader, cleaner, analyzer])

    result = await pipeline.invoke(
        task="Load sales_data.csv and analyze it.",
        runtime=runtime
    )

    print(f"Analysis:\n{await result.get()}")
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
# 1. OpenAI
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# 2. Ollama / VLLM (Local)
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

loader = Agent(role='Data Loader', goal='Load raw data', backstory='Data Engineer.', verbose=True)
cleaner = Agent(role='Data Cleaner', goal='Clean datasets', backstory='Quality Engineer.', verbose=True)
analyzer = Agent(role='Data Analyst', goal='Analyze trends', backstory='Analyst.', verbose=True)

task1 = Task(description='Load the "sales_data.csv" file (simulate content).', expected_output='Raw CSV string.', agent=loader)
task2 = Task(description='Clean the raw CSV data.', expected_output='Cleaned CSV string.', agent=cleaner)
task3 = Task(description='Analyze the cleaned data for trends.', expected_output='Statistical summary.', agent=analyzer)

crew = Crew(
    agents=[loader, cleaner, analyzer],
    tasks=[task1, task2, task3],
    process=Process.sequential
)

result = crew.kickoff()
print(f"\nAnalysis Result:\n{result}")`
                    }
                ]
            }
        ]
    },
    concurrent: {
        title: "Concurrent Orchestration",
        description: "Broadcast a task to multiple agents simultaneously and aggregate their results.",
        analogy: {
            title: "Real World Analogy: The Panel of Experts",
            text: "Imagine a game show where three experts are asked the same question. They write answers independently and reveal them at once."
        },
        examples: [
            {
                id: "conc-ex1",
                title: "Example 1: Science Panel",
                intro: "<strong>Goal:</strong> Understand a concept from different academic perspectives.",
                steps: [
                    { title: "Physics Expert", text: "Instructed to view the world through energy, forces, and matter." },
                    { title: "Chemistry Expert", text: "Instructed to view the world through molecular bonds and reactions." },
                    { title: "Execution", text: "Both agents receive the prompt at the exact same time." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, ConcurrentOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    physics = ChatCompletionAgent(
        name="Physics",
        instructions="Explain concepts via physics (matter, energy).",
        service=service
    )
    chemistry = ChatCompletionAgent(
        name="Chemistry",
        instructions="Explain concepts via chemistry (molecules, reactions).",
        service=service
    )

    orchestration = ConcurrentOrchestration(members=[physics, chemistry])

    print("Broadcasting task to experts...")
    result = await orchestration.invoke(task="What is fire?", runtime=runtime)
    
    responses = await result.get()
    for msg in responses:
        print(f"\n--- {msg.name} ---\n{msg.content}")

    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

physics = Agent(
    role='Physics Expert',
    goal='Explain phenomena using physics principles',
    backstory='PhD in Physics.',
    verbose=True
)

chemistry = Agent(
    role='Chemistry Expert',
    goal='Explain phenomena using chemistry principles',
    backstory='PhD in Chemistry.',
    verbose=True
)

# Tasks with async_execution=True run in parallel
task_phys = Task(
    description='Explain "What is fire?" from a physics perspective.',
    expected_output='Physics explanation.',
    agent=physics,
    async_execution=True
)

task_chem = Task(
    description='Explain "What is fire?" from a chemistry perspective.',
    expected_output='Chemistry explanation.',
    agent=chemistry,
    async_execution=True
)

# Aggregator Task
aggregator = Agent(role='Scribe', goal='Compile answers', backstory='Note taker.')
task_agg = Task(
    description='Compile the answers from the experts.',
    expected_output='A combined report containing both explanations.',
    agent=aggregator,
    context=[task_phys, task_chem] # Waits for async tasks
)

crew = Crew(
    agents=[physics, chemistry, aggregator],
    tasks=[task_phys, task_chem, task_agg],
    process=Process.sequential # The structure handles parallelism via async tasks
)

result = crew.kickoff()
print(f"\n--- Panel Results ---\n{result}")`
                    }
                ]
            },
            {
                id: "conc-ex2",
                title: "Example 2: Travel Scout",
                intro: "<strong>Goal:</strong> Quickly gather travel options for a trip.",
                steps: [
                    { title: "Flight Scout", text: "Finds flight options." },
                    { title: "Hotel Scout", text: "Finds accommodation options." },
                    { title: "Parallel Execution", text: "Waiting for one shouldn't block the others." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, ConcurrentOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    flight = ChatCompletionAgent(name="FlightScout", instructions="List flight options.", service=service)
    hotel = ChatCompletionAgent(name="HotelScout", instructions="List hotel options.", service=service)

    orchestration = ConcurrentOrchestration(members=[flight, hotel])

    result = await orchestration.invoke(task="Plan a weekend in Tokyo", runtime=runtime)
    
    responses = await result.get()
    for msg in responses:
        print(f"\n[{msg.name}]: {msg.content}")

    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

flight_agent = Agent(role='Flight Scout', goal='Find flights', backstory='Travel agent.', verbose=True)
hotel_agent = Agent(role='Hotel Scout', goal='Find hotels', backstory='Concierge.', verbose=True)

# Parallel Tasks
task_flight = Task(
    description='Find flights to Tokyo for this weekend.',
    expected_output='List of flights.',
    agent=flight_agent,
    async_execution=True
)

task_hotel = Task(
    description='Find hotels in Tokyo for this weekend.',
    expected_output='List of hotels.',
    agent=hotel_agent,
    async_execution=True
)

# Aggregator
compiler = Agent(role='Compiler', goal='Create itinerary', backstory='Planner.')
task_compile = Task(
    description='Create a travel summary.',
    expected_output='Travel plan.',
    agent=compiler,
    context=[task_flight, task_hotel]
)

crew = Crew(
    agents=[flight_agent, hotel_agent, compiler],
    tasks=[task_flight, task_hotel, task_compile]
)

result = crew.kickoff()
print(f"\nTravel Plan:\n{result}")`
                    }
                ]
            },
            {
                id: "conc-ex3",
                title: "Example 3: News Aggregator",
                intro: "<strong>Goal:</strong> Fetch news from multiple domains simultaneously.",
                steps: [
                    { title: "Tech Reporter", text: "Fetches latest technology news." },
                    { title: "Finance Reporter", text: "Fetches market updates." },
                    { title: "Sports Reporter", text: "Fetches game scores." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, ConcurrentOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    tech = ChatCompletionAgent(name="Tech", instructions="Fetch tech news headlines.", service=service)
    finance = ChatCompletionAgent(name="Finance", instructions="Fetch market news.", service=service)
    sports = ChatCompletionAgent(name="Sports", instructions="Fetch sports scores.", service=service)

    orchestration = ConcurrentOrchestration(members=[tech, finance, sports])

    result = await orchestration.invoke(task="What happened today?", runtime=runtime)
    
    for msg in await result.get():
        print(f"\n[{msg.name}]: {msg.content}")

    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
# 1. OpenAI
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# 2. Ollama / VLLM (Local)
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

tech = Agent(role='Tech Reporter', goal='Tech news', backstory='Journalist.', verbose=True)
finance = Agent(role='Finance Reporter', goal='Market news', backstory='Analyst.', verbose=True)
sports = Agent(role='Sports Reporter', goal='Sports news', backstory='Commentator.', verbose=True)

t1 = Task(description='Get tech news.', expected_output='Tech summary.', agent=tech, async_execution=True)
t2 = Task(description='Get finance news.', expected_output='Market summary.', agent=finance, async_execution=True)
t3 = Task(description='Get sports news.', expected_output='Scores summary.', agent=sports, async_execution=True)

# Aggregator
editor = Agent(role='Editor', goal='Compile news', backstory='Chief Editor.')
t4 = Task(description='Create a daily digest.', expected_output='News digest.', agent=editor, context=[t1, t2, t3])

crew = Crew(agents=[tech, finance, sports, editor], tasks=[t1, t2, t3, t4])
result = crew.kickoff()
print(f"\nDaily Digest:\n{result}")`
                    }
                ]
            }
        ]
    },
    groupchat: {
        title: "Group Chat Orchestration",
        description: "Collaborative dialogue managed by a router/manager.",
        analogy: {
            title: "Real World Analogy: The Board Meeting",
            text: "The Manager decides who speaks next. 'Lawyer, check this.' -> 'Engineer, can we build this?'"
        },
        examples: [
            {
                id: "group-ex1",
                title: "Example 1: Creative Debate",
                intro: "<strong>Goal:</strong> Create a perfect slogan through critique and revision.",
                steps: [
                    { title: "The Creative", text: "Proposes bold, catchy ideas." },
                    { title: "The Critic", text: "Analyzes the slogan for flaws." },
                    { title: "The Manager", text: "Forces them to take turns (Round Robin or Hierarchical)." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, GroupChatOrchestration, RoundRobinGroupChatManager
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    creative_agent = ChatCompletionAgent(
        name="Creative",
        instructions="Propose bold, catchy slogan ideas.",
        service=service
    )
    critic_agent = ChatCompletionAgent(
        name="Critic",
        instructions="Review slogans for clarity and punchiness.",
        service=service
    )

    chat = GroupChatOrchestration(
        members=[creative_agent, critic_agent],
        manager=RoundRobinGroupChatManager(max_rounds=6),
        agent_response_callback=lambda msg: print(f"[{msg.name}]: {msg.content}\n")
    )

    result = await chat.invoke(task="Slogan for coffee.", runtime=runtime)
    print(f"***** Final Slogan *****\n{await result.get()}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

creative = Agent(
    role='Creative Copywriter',
    goal='Generate catchy slogans',
    backstory='Creative genius.',
    verbose=True
)

critic = Agent(
    role='Slogan Critic',
    goal=' critique slogans',
    backstory='Harsh marketing critic.',
    verbose=True
)

# The task is high level, asking for iteration
task = Task(
    description='Create a slogan for a new coffee brand. Have the Creative propose one, then have the Critic review it. Iterate until it is perfect.',
    expected_output='A final polished slogan.',
    agent=None # No specific agent, the manager decides
)

crew = Crew(
    agents=[creative, critic],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4", # Or "ollama/llama3"
)

result = crew.kickoff()
print(f"\nFinal Consensus:\n{result}")`
                    }
                ]
            },
            {
                id: "group-ex2",
                title: "Example 2: Code Review",
                intro: "<strong>Goal:</strong> Fix a buggy function through discussion.",
                steps: [
                    { title: "Junior Developer", text: "Writes initial solution." },
                    { title: "Senior Developer", text: "Reviews logic." },
                    { title: "Collaboration", text: "Group discusses until code is solid." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, GroupChatOrchestration, RoundRobinGroupChatManager
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    junior = ChatCompletionAgent(name="Junior", instructions="Write SQL query code.", service=service)
    senior = ChatCompletionAgent(name="Senior", instructions="Review code.", service=service)

    chat = GroupChatOrchestration(
        members=[junior, senior],
        manager=RoundRobinGroupChatManager(max_rounds=6)
    )

    result = await chat.invoke(task="Write a Python function to query SQL.", runtime=runtime)
    print(f"Final Code:\n{await result.get()}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-"
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/codellama"
# ------------------------------

junior = Agent(role='Junior Dev', goal='Write code', backstory='New grad.', verbose=True)
senior = Agent(role='Senior Dev', goal='Review code', backstory='Tech lead.', verbose=True)

task = Task(
    description='Write a secure Python function to query a SQL DB. Iterate on the code to ensure it is secure and efficient.',
    expected_output='Final Python function.',
)

crew = Crew(
    agents=[junior, senior],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4" # Or "ollama/codellama"
)

result = crew.kickoff()
print(f"\nFinal Code:\n{result}")`
                    }
                ]
            },
            {
                id: "group-ex3",
                title: "Example 3: Legal Drafting",
                intro: "<strong>Goal:</strong> Draft a contract with multiple rounds of revision.",
                steps: [
                    { title: "Lawyer", text: "Drafts the initial contract clauses." },
                    { title: "Risk Officer", text: "Reviews for liability and suggests changes." },
                    { title: "Client", text: "Simulated client providing requirements." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, GroupChatOrchestration, RoundRobinGroupChatManager
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    lawyer = ChatCompletionAgent(name="Lawyer", instructions="Draft contract clauses.", service=service)
    risk = ChatCompletionAgent(name="Risk", instructions="Check for liability.", service=service)
    client = ChatCompletionAgent(name="Client", instructions="I want a risk-free NDA.", service=service)

    chat = GroupChatOrchestration(
        members=[client, lawyer, risk],
        manager=RoundRobinGroupChatManager(max_rounds=6)
    )

    result = await chat.invoke(task="Draft an NDA for Project X.", runtime=runtime)
    print(f"Contract:\n{await result.get()}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
# 1. OpenAI
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# 2. Ollama / VLLM (Local)
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

lawyer = Agent(role='Lawyer', goal='Draft contract', backstory='Corporate Attorney.', verbose=True)
risk = Agent(role='Risk Officer', goal='Minimize liability', backstory='Risk Manager.', verbose=True)

task = Task(
    description='Draft an NDA. The lawyer drafts, the risk officer reviews. Iterate until safe.',
    expected_output='Final NDA text.',
)

crew = Crew(
    agents=[lawyer, risk],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4"
)

result = crew.kickoff()
print(f"\nContract:\n{result}")`
                    }
                ]
            }
        ]
    },
    handoff: {
        title: "Handoff Orchestration",
        description: "Dynamic routing of tasks to specialized agents.",
        analogy: {
            title: "Real World Analogy: The Call Center",
            text: "Receptionist transfers you to the right department."
        },
        examples: [
            {
                id: "hand-ex1",
                title: "Example 1: Customer Support",
                intro: "<strong>Goal:</strong> Efficiently handle user complaints.",
                steps: [
                    { title: "Routing", text: "A Manager/Router identifies intent (Refund vs Tech) and delegates." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, OrchestrationHandoffs, HandoffOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    triage = ChatCompletionAgent(name="Triage", instructions="Greet user.", service=service)
    refund = ChatCompletionAgent(name="Refund", instructions="Handle refunds.", service=service)
    tech = ChatCompletionAgent(name="Tech", instructions="Handle errors.", service=service)

    routes = OrchestrationHandoffs()
    routes.add(source_agent="Triage", target_agent="Refund", description="Refund")
    routes.add(source_agent="Triage", target_agent="Tech", description="Error")

    orchestration = HandoffOrchestration(
        members=[triage, refund, tech],
        handoffs=routes
    )

    result = await orchestration.invoke(task="I want a refund.", runtime=runtime)
    await result.get()
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

refund_agent = Agent(role='Refund Specialist', goal='Process refunds', backstory='Support agent.', verbose=True)
tech_agent = Agent(role='Tech Support', goal='Fix technical issues', backstory='Engineer.', verbose=True)

# In CrewAI Hierarchical, the manager acts as the Router/Triage
task = Task(
    description='User Request: "I want a refund for my order". Handle this request using the appropriate agent.',
    expected_output='Resolution message.',
)

crew = Crew(
    agents=[refund_agent, tech_agent],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4" # Or "ollama/llama3"
)

result = crew.kickoff()
print(f"\nResolution:\n{result}")`
                    }
                ]
            },
            {
                id: "hand-ex2",
                title: "Example 2: Smart Home",
                intro: "<strong>Goal:</strong> Control different home systems.",
                steps: [
                    { title: "Specialists", text: "Lighting, Music, Security agents." },
                    { title: "Routing", text: "Manager delegates 'Play Jazz' to Music Agent." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, OrchestrationHandoffs, HandoffOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    butler = ChatCompletionAgent(name="Butler", instructions="Interface.", service=service)
    music = ChatCompletionAgent(name="Music", instructions="Audio control.", service=service)

    routes = OrchestrationHandoffs()
    routes.add(source_agent="Butler", target_agent="Music", description="Audio")
    routes.add(source_agent="Music", target_agent="Butler", description="Done")

    orchestration = HandoffOrchestration(
        members=[butler, music],
        handoffs=routes
    )

    result = await orchestration.invoke(task="Play Jazz", runtime=runtime)
    await result.get()
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

music_agent = Agent(role='Music Controller', goal='Control audio', backstory='DJ.', verbose=True)
light_agent = Agent(role='Light Controller', goal='Control lights', backstory='Electrician.', verbose=True)

task = Task(
    description='User Request: "Dim the lights". Execute this command.',
    expected_output='Confirmation of action.',
)

crew = Crew(
    agents=[music_agent, light_agent],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4"
)

result = crew.kickoff()
print(f"\nAction:\n{result}")`
                    }
                ]
            },
            {
                id: "hand-ex3",
                title: "Example 3: Patient Triage",
                intro: "<strong>Goal:</strong> Route patients to the correct medical professional.",
                steps: [
                    { title: "Nurse Triage", text: "Asks initial symptoms." },
                    { title: "GP", text: "Handles common colds/flu." },
                    { title: "Specialist", text: "Handles critical injuries." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, OrchestrationHandoffs, HandoffOrchestration
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    nurse = ChatCompletionAgent(name="Nurse", instructions="Ask symptoms.", service=service)
    gp = ChatCompletionAgent(name="GP", instructions="Treat cold/flu.", service=service)
    specialist = ChatCompletionAgent(name="Specialist", instructions="Treat injuries.", service=service)

    routes = OrchestrationHandoffs()
    routes.add(source_agent="Nurse", target_agent="GP", description="Mild symptoms")
    routes.add(source_agent="Nurse", target_agent="Specialist", description="Severe injury")

    orchestration = HandoffOrchestration(
        members=[nurse, gp, specialist],
        handoffs=routes
    )

    result = await orchestration.invoke(task="I have a broken leg.", runtime=runtime)
    await result.get()
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
# 1. OpenAI
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# 2. Ollama / VLLM (Local)
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

gp = Agent(role='GP', goal='Treat mild illness', backstory='Doctor.', verbose=True)
specialist = Agent(role='Surgeon', goal='Treat trauma', backstory='Trauma Surgeon.', verbose=True)

task = Task(
    description='Patient: "I have a broken leg". Route to the correct doctor.',
    expected_output='Treatment plan.',
)

crew = Crew(
    agents=[gp, specialist],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4"
)

result = crew.kickoff()
print(f"\nTreatment:\n{result}")`
                    }
                ]
            }
        ]
    },
    magentic: {
        title: "Magentic Orchestration",
        description: "Autonomous planning. A manager breaks down complex tasks.",
        analogy: {
            title: "Real World Analogy: The General Contractor",
            text: "The GC creates a plan and hires the right people to execute it."
        },
        examples: [
            {
                id: "mag-ex1",
                title: "Example 1: Research & Report",
                intro: "<strong>Goal:</strong> Answer a complex question that requires multi-step investigation.",
                steps: [
                    { title: "Planning", text: "The Manager creates a plan." },
                    { title: "Execution", text: "Researcher finds data, Analyst processes it." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, MagenticOrchestration, StandardMagenticManager
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    researcher = ChatCompletionAgent(name="Researcher", instructions="Find data.", service=service)
    analyst = ChatCompletionAgent(name="Analyst", instructions="Analyze data.", service=service)

    manager = StandardMagenticManager(chat_completion_service=service)
    team = MagenticOrchestration(members=[researcher, analyst], manager=manager)

    result = await team.invoke(task="Compare NYC and London growth.", runtime=runtime)
    print(f"Report:\n{await result.get()}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-"
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

researcher = Agent(role='Researcher', goal='Find data', backstory='PhD.', verbose=True)
analyst = Agent(role='Analyst', goal='Analyze data', backstory='Data Scientist.', verbose=True)

# CrewAI Planning Mode (similar to Magentic)
# By setting planning=True, CrewAI uses an internal planner to break down the task.
crew = Crew(
    agents=[researcher, analyst],
    tasks=[
        Task(
            description='Compare population growth of NYC vs London over 50 years.',
            expected_output='Comprehensive report.',
            agent=None # Let planner/manager decide
        )
    ],
    process=Process.hierarchical,
    manager_llm="gpt-4",
    planning=True # Enable autonomous planning!
)

result = crew.kickoff()
print(f"\nReport:\n{result}")`
                    }
                ]
            },
            {
                id: "magentic-ex2",
                title: "Example 2: Competitive Analysis",
                intro: "<strong>Goal:</strong> Generate a feature matrix comparing our product to competitors.",
                steps: [
                    { title: "Agents", text: "Web Surfer and Matrix Builder." },
                    { title: "Autonomous Planning", text: "System loops through sites and aggregates data." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, MagenticOrchestration, StandardMagenticManager
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    surfer = ChatCompletionAgent(name="WebSurfer", instructions="Extract data.", service=service)
    builder = ChatCompletionAgent(name="Builder", instructions="Format matrix.", service=service)

    manager = StandardMagenticManager(chat_completion_service=service)
    team = MagenticOrchestration(members=[surfer, builder], manager=manager)

    result = await team.invoke(task="Compare Salesforce vs HubSpot.", runtime=runtime)
    print(f"Matrix:\n{await result.get()}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
os.environ["OPENAI_API_KEY"] = "sk-"
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# For Local/Ollama:
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

surfer = Agent(role='Web Surfer', goal='Extract pricing', backstory='Scraper.', verbose=True)
builder = Agent(role='Matrix Builder', goal='Format data', backstory='Analyst.', verbose=True)

crew = Crew(
    agents=[surfer, builder],
    tasks=[
        Task(
            description='Create a pricing matrix for Salesforce vs HubSpot.',
            expected_output='Markdown table.',
        )
    ],
    process=Process.hierarchical,
    manager_llm="gpt-4",
    planning=True
)

result = crew.kickoff()
print(f"\nMatrix:\n{result}")`
                    }
                ]
            },
            {
                id: "mag-ex3",
                title: "Example 3: Event Planner",
                intro: "<strong>Goal:</strong> Plan a complex multi-day corporate event.",
                steps: [
                    { title: "Venue Scout", text: "Finds locations and pricing." },
                    { title: "Catering Manager", text: "Handles food menus." },
                    { title: "Logistics", text: "Handles transportation." }
                ],
                implementations: [
                    {
                        id: "sk",
                        name: "Semantic Kernel",
                        install: "uv add semantic-kernel",
                        code: `import asyncio
from semantic_kernel.agents import ChatCompletionAgent, MagenticOrchestration, StandardMagenticManager
from semantic_kernel.agents.runtime import InProcessRuntime
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

async def main():
    # --- SETUP: Choose your Service ---
    # 1. Standard OpenAI
    service = OpenAIChatCompletion(ai_model_id="gpt-4", api_key="sk-...")
    
    # 2. Local (Ollama)
    # service = OpenAIChatCompletion(
    #    ai_model_id="llama3", 
    #    api_key="ollama", 
    #    base_url="http://localhost:11434/v1"
    # )
    # ----------------------------------

    runtime = InProcessRuntime()
    runtime.start()

    scout = ChatCompletionAgent(name="Scout", instructions="Find venues.", service=service)
    caterer = ChatCompletionAgent(name="Caterer", instructions="Plan menu.", service=service)
    logistics = ChatCompletionAgent(name="Logistics", instructions="Plan travel.", service=service)

    manager = StandardMagenticManager(chat_completion_service=service)
    team = MagenticOrchestration(members=[scout, caterer, logistics], manager=manager)

    result = await team.invoke(task="Plan a 3-day tech conference for 500 people in Austin.", runtime=runtime)
    print(f"Plan:\n{await result.get()}")
    
    await runtime.stop_when_idle()

if __name__ == "__main__":
    asyncio.run(main())`
                    },
                    {
                        id: "crew",
                        name: "CrewAI",
                        install: "uv add crewai",
                        code: `import os
from crewai import Agent, Task, Crew, Process

# --- SETUP: Choose your LLM ---
# 1. OpenAI
os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["OPENAI_MODEL_NAME"] = "gpt-4"
# 2. Ollama / VLLM (Local)
# os.environ["OPENAI_API_BASE"] = "http://localhost:11434/v1"
# os.environ["OPENAI_MODEL_NAME"] = "ollama/llama3"
# ------------------------------

scout = Agent(role='Venue Scout', goal='Find venues', backstory='Event Planner.', verbose=True)
caterer = Agent(role='Caterer', goal='Plan menu', backstory='Chef.', verbose=True)
logistics = Agent(role='Logistics', goal='Plan travel', backstory='Coordinator.', verbose=True)

crew = Crew(
    agents=[scout, caterer, logistics],
    tasks=[
        Task(
            description='Plan a 3-day tech conference for 500 people in Austin.',
            expected_output='Complete event plan.',
        )
    ],
    process=Process.hierarchical,
    manager_llm="gpt-4",
    planning=True
)

result = crew.kickoff()
print(f"\nPlan:\n{result}")`
                    }
                ]
            }
        ]
    },
        advanced: {
            title: "Advanced Topics",
            content: `
            <h1>Advanced Topics</h1>
            <p class="lead">Master the runtime control and data handling of your agent systems with these powerful features.</p>
    
            <!-- Timeouts -->
            <section class="advanced-section" style="margin-bottom: 6rem;">
                <h2>⏱️ Timeouts</h2>
                <p style="margin-bottom:20px">Long-running agent tasks can hang your application or deplete budgets. Enforcing timeouts ensures your system remains responsive even if a model fails to terminate a response or gets stuck in a loop.</p>
                
                <div class="implementation active">
                    <details class="full-code" open>
                        <summary>
                            <span>Implementation Example</span>
                            <button class="copy-btn" onclick="copyCode(event, this)">Copy Code</button>
                        </summary>
                        <pre><code class="language-python">import asyncio
    from semantic_kernel.agents import SequentialOrchestration
    
    # Enforce a 60-second limit on the entire workflow
    try:
        result = await orchestration.invoke(task="Analyze this document", runtime=runtime)
        
        # The .get() call is where we specify the timeout
        output = await result.get(timeout=60)
        print(f"Final output: {output}")
        
    except TimeoutError:
        print("The agent orchestration exceeded the 60-second time limit.")
        # You can decide to retry or fallback here</code></pre>
                    </details>
                </div>
            </section>
    
            <!-- Cancellation -->
            <section class="advanced-section" style="margin-bottom: 6rem;">
                <h2>🛑 Cancellation</h2>
                <p style="margin-bottom:20px">Sometimes you need to stop an agent immediately—perhaps the user canceled their request or a high-priority event interrupted the workflow. Explicit cancellation stops the orchestration logic and stops further message processing.</p>
                
                <div class="implementation active">
                    <details class="full-code" open>
                        <summary>
                            <span>Implementation Example</span>
                            <button class="copy-btn" onclick="copyCode(event, this)">Copy Code</button>
                        </summary>
                        <pre><code class="language-python"># Start an asynchronous task
    result = await orchestration.invoke(task="Perform deep research", runtime=runtime)
    
    # Logic to monitor for cancellation (e.g. user clicks "Stop")
    if user_clicked_cancel:
        print("Stopping agents...")
        result.cancel()
        
        # result.get() will now raise a CancelledError if awaited
        try:
            await result.get()
        except asyncio.CancelledError:
            print("Workflow successfully stopped.")</code></pre>
                    </details>
                </div>
            </section>
    
            <!-- Structured Data -->
            <section class="advanced-section" style="margin-bottom: 6rem;">
                <h2>🏗️ Structured Data (Typed Outputs)</h2>
                <p style="margin-bottom:20px">Relying on raw strings is brittle for enterprise applications. Semantic Kernel allows you to bind Pydantic models to orchestrations, forcing the agents to return strictly validated JSON that maps directly to Python objects.</p>
                
                <div class="implementation active">
                    <div class="install-card" style="margin-bottom: 1.5rem;">
                        <span class="install-label">Dependencies</span>
                        <span class="install-cmd">uv add pydantic</span>
                    </div>
                    <details class="full-code" open>
                        <summary>
                            <span>Implementation Example</span>
                            <button class="copy-btn" onclick="copyCode(event, this)">Copy Code</button>
                        </summary>
                        <pre><code class="language-python">from pydantic import BaseModel, Field
    from semantic_kernel.agents import ConcurrentOrchestration
    from semantic_kernel.agents.orchestration.tools import structured_outputs_transform
    
    # 1. Define your data schema
    class SentimentAnalysis(BaseModel):
        score: float = Field(description="0.0 to 1.0")
        label: str = Field(description="Positive, Negative, or Neutral")
        entities: list[str]
    
    # 2. Configure orchestration with Typed Output
    # [Input Type, Output Type]
    orchestration = ConcurrentOrchestration[str, SentimentAnalysis](
        members=[analyst_agent],
        # Automatically converts LLM JSON response to Pydantic object
        output_transform=structured_outputs_transform(SentimentAnalysis, service)
    )
    
    # 3. Invoke and get Typed Data
    result = await orchestration.invoke("This product is amazing and fast!", runtime)
    data = await result.get()
    
    # Access with full IDE autocompletion and type safety
    print(f"Sentiment: {data.label} ({data.score})")
    for ent in data.entities:
        print(f"Detected: {ent}")</code></pre>
                    </details>
                </div>
            </section>
            `
        }
    };
