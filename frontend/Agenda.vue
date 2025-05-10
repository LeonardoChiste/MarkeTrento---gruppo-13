<template>
  <div class="agenda-container">
    <div class="controls">
      <button @click="previousWeek">Previous</button>
      <h2>{{ weekRange }}</h2>
      <button @click="nextWeek">Next</button>
    </div>

    <div class="calendar-grid">
      <div v-for="day in days" :key="day.date" class="day-column">
        <div class="day-header">
          <h3>{{ day.dayName }}</h3>
          <p>{{ day.date }}</p>
        </div>
        <div class="events">
          <div v-for="event in day.events" :key="event.id" class="event-card">
            <img :src="event.imageUrl" alt="Event image" class="event-image" />
            <div class="event-details">
              <h4>{{ event.title }}</h4>
              <p class="event-time">{{ event.time }}</p>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      events: [
        {
          id: 1,
          title: 'Team Meeting',
          description: 'Weekly team sync-up',
          date: '2023-11-06',
          time: '10:00 AM',
          imageUrl: 'https://via.placeholder.com/50'
        },
        {
          id: 2,
          title: 'Project Demo',
          description: 'Client presentation',
          date: '2023-11-08',
          time: '2:30 PM',
          imageUrl: 'https://via.placeholder.com/50'
        },
        // Add more events here...
      ]
    }
  },
  computed: {
    startOfWeek() {
      const date = new Date(this.currentDate)
      const day = date.getDay()
      const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when Sunday
      return new Date(date.setDate(diff))
    },
    weekRange() {
      const endOfWeek = new Date(this.startOfWeek)
      endOfWeek.setDate(this.startOfWeek.getDate() + 6)
      return `${this.startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`
    },
    days() {
      const days = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(this.startOfWeek)
        date.setDate(date.getDate() + i)
        
        const dayEvents = this.events.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate.toDateString() === date.toDateString()
        })

        days.push({
          date: date.toLocaleDateString(),
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          events: dayEvents
        })
      }
      return days
    }
  },
  methods: {
    previousWeek() {
      this.currentDate = new Date(
        this.currentDate.setDate(this.currentDate.getDate() - 7)
      )
    },
    nextWeek() {
      this.currentDate = new Date(
        this.currentDate.setDate(this.currentDate.getDate() + 7)
      )
    }
  }
}
</script>

<style scoped>
.agenda-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}

.day-column {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 10px;
}

.day-header {
  text-align: center;
  margin-bottom: 10px;
}

.event-card {
  background: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.event-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.event-details {
  flex: 1;
}

.event-time {
  font-size: 0.8em;
  color: #666;
}

.event-description {
  font-size: 0.9em;
  color: #444;
  margin-top: 5px;
}
</style>