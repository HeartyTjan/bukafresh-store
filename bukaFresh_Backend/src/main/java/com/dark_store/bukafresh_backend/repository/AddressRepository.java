package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends MongoRepository<Address, String> {

    Optional<List<Address>>  findByUserId(String userId);
}
