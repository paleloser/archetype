FROM maven:3-eclipse-temurin-21 AS builder

WORKDIR /server

COPY . .

# Checkstyle, Spotbugs and tests already ran locally (mvn verify) before merge: the image build only packages.
RUN mvn -B -ntp clean package -DskipTests -Dcheckstyle.skip=true -Dspotbugs.skip=true

FROM eclipse-temurin:21-jre-alpine AS runner

ARG JAR_FILE=backend-*.jar

RUN mkdir /app

WORKDIR /app

RUN addgroup --system --gid 1001 java
RUN adduser --system --uid 1001 java

COPY --from=builder /server/backend/target/${JAR_FILE} /app/server.jar

USER java

EXPOSE 8080

# The JVM caps the heap at 25% of the container limit by default, which is only ~128MB
# of heap on a 512MB instance. Override at deploy time if the instance is bigger.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"
ENV SPRING_PROFILES_ACTIVE=production

ENTRYPOINT ["java","-jar","server.jar"]
